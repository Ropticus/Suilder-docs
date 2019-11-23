# CRUD operations
Suilder **does not have inbuilt** CRUD operations, but the following example shows a simple implementation.

!!! note
    We assumed that the primary key is a single column. To execute the queries we are using [Dapper](https://github.com/StackExchange/Dapper), but you can use any other library.

!!! warning
    This example may not give you the best performance because it uses reflection to support nested types and name translations.

```csharp
public class CrudExample
{
    private IDbConnection con;

    private ISqlBuilder sql;

    private IEngine engine;

    public CrudExample(IDbConnection con, ISqlBuilder sql, IEngine engine)
    {
        this.con = con;
        this.sql = sql;
        this.engine = engine;
    }

    public T Get<T>(int id) where T : new()
    {
        IAlias<T> alias = sql.Alias<T>();

        // Get table info
        ITableInfo tableInfo = engine.GetInfo<T>();
        string primaryKey = tableInfo.PrimaryKeys[0];

        // Select query
        IQuery query = sql.Query
            .Select(alias.All)
            .From(alias)
            .Where(alias[primaryKey].Eq(id));

        // Compile an execute
        QueryResult result = engine.Compile(query);

        // Map result
        return Map<T>(tableInfo, con.QuerySingleOrDefault(result.Sql, result.Parameters));
    }

    public IEnumerable<T> GetAll<T>() where T : new()
    {
        IAlias<T> alias = sql.Alias<T>();

        // Get table info
        ITableInfo tableInfo = engine.GetInfo<T>();

        // Select query
        IQuery query = sql.Query
            .Select(alias.All)
            .From(alias);

        // Compile an execute
        QueryResult result = engine.Compile(query);

        // Map result
        return con.Query(result.Sql, result.Parameters).Cast<IDictionary<string, object>>()
            .Select(x => Map<T>(tableInfo, x));
    }

    private T Map<T>(ITableInfo tableInfo, IDictionary<string, object> columns) where T : new()
    {
        T entity = new T();
        foreach (var column in columns)
        {
            // We can have multiple properties mapped to the same column
            foreach (var colName in tableInfo.ColumnNamesDic.Where(x => x.Value == column.Key))
            {
                SetValue(entity, colName.Key, column.Value);
            }
        }

        return entity;
    }

    public T Insert<T>(T entity)
    {
        IAlias<T> alias = sql.Alias<T>();

        // Get table info
        ITableInfo tableInfo = engine.GetInfo<T>();
        string primaryKey = tableInfo.PrimaryKeys[0];
        bool autoincrement = tableInfo.GetMetadata<bool>(primaryKey, "autoincrement");

        IInsert insert = sql.Insert().Into(alias);
        IValList values = sql.ValList;

        // We can have multiple properties mapped to the same column
        ISet<string> columnNamesAdded = new HashSet<string>();

        // Get columns
        foreach (string column in tableInfo.Columns)
        {
            // Skip primary key if is auto increment
            if (column == primaryKey && autoincrement)
                continue;

            // Skip duplicate property
            string columnName = tableInfo.GetColumnName(column);
            if (columnNamesAdded.Contains(columnName))
                continue;
            else
                columnNamesAdded.Add(columnName);

            // Add column and value
            insert.Add(alias[column]);
            values.Add(GetValue(entity, column));
        }

        // Insert query
        IQuery query = sql.Query.Insert(insert).Values(values);

        // Compile and execute
        QueryResult result = engine.Compile(query);
        con.Execute(result.Sql, result.Parameters);

        // Get primary key if is auto increment
        if (autoincrement)
        {
            query = sql.Query.Select(SqlFn.LastInsertId());

            // Compile and execute
            result = engine.Compile(query);
            int valuePK = con.ExecuteScalar<int>(result.Sql, result.Parameters);

            // Update property
            SetValue(entity, primaryKey, valuePK);
        }

        return entity;
    }

    public T Update<T>(T entity)
    {
        IAlias<T> alias = sql.Alias<T>();

        // Get table info
        ITableInfo tableInfo = engine.GetInfo<T>();
        string primaryKey = tableInfo.PrimaryKeys[0];

        // Update query
        IQuery query = sql.Query.Update()
            .From(alias)
            .Where(alias[primaryKey].Eq(GetValue(entity, primaryKey)));

        // We can have multiple properties mapped to the same column
        ISet<string> columnNamesAdded = new HashSet<string>();

        // Get columns
        foreach (string column in tableInfo.Columns)
        {
            // Skip primary key
            if (column == primaryKey)
                continue;

            // Skip duplicate property
            string columnName = tableInfo.GetColumnName(column);
            if (columnNamesAdded.Contains(columnName))
                continue;
            else
                columnNamesAdded.Add(columnName);

            // Set value
            query.Set(alias[column], GetValue(entity, column));
        }

        // Compile and execute
        QueryResult result = engine.Compile(query);
        con.Execute(result.Sql, result.Parameters);

        return entity;
    }

    public void Delete<T>(T entity)
    {
        IAlias<T> alias = sql.Alias<T>();

        // Get table info
        string primaryKey = engine.GetInfo<T>().PrimaryKeys[0];

        // Delete query
        IQuery query = sql.Query
            .Delete()
            .From(alias)
            .Where(alias[primaryKey].Eq(GetValue(entity, primaryKey)));

        // Compile and execute
        QueryResult result = engine.Compile(query);
        con.Execute(result.Sql, result.Parameters);
    }

    private object GetValue(object obj, string property)
    {
        foreach (string prop in property.Split('.'))
        {
            obj = obj.GetType().GetProperty(prop).GetValue(obj);

            if (obj == null)
                return null;
        }

        return obj;
    }

    private void SetValue(object obj, string property, object value)
    {
        string[] properties = property.Split('.');

        // Initialize nested objects
        for (int i = 0; i < properties.Length - 1; i++)
        {
            PropertyInfo propertyInfo = obj.GetType().GetProperty(properties[i]);

            object nestedObj = propertyInfo.GetValue(obj);

            if (nestedObj == null)
            {
                nestedObj = Activator.CreateInstance(propertyInfo.PropertyType);
                propertyInfo.SetValue(obj, nestedObj);
            }

            obj = nestedObj;
        }

        // Set value
        PropertyInfo propertyInfoValue = obj.GetType().GetProperty(properties[properties.Length - 1]);
        propertyInfoValue.SetValue(obj, Convert.ChangeType(value, propertyInfoValue.PropertyType));
    }
}
```