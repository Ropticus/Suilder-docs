# CRUD operations
Suilder **does not have inbuilt** CRUD operations, but the following example shows a simple implementation.

In this example we assumed that the primary key is a single column with auto increment, and ignore navigation properties for simplicity. To execute the queries we are using [Dapper](https://github.com/StackExchange/Dapper), but you can use any other library.

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

    public T Get<T>(int id)
    {
        Type type = typeof(T);
        string primaryKey = engine.GetPrimaryKeys(type)[0];
        IAlias<T> alias = sql.Alias<T>();

        // Select query
        IQuery query = sql.Query
            .Select(alias.All)
            .From(alias)
            .Where(alias[primaryKey].Eq(id));

        // Compile an execute
        QueryResult result = engine.Compile(query);
        return con.QuerySingleOrDefault<T>(result.Sql, result.Parameters);
    }

    public T Insert<T>(T entity)
    {
        Type type = typeof(T);
        string primaryKey = engine.GetPrimaryKeys(type)[0];
        IAlias<T> alias = sql.Alias<T>();

        IInsert insert = sql.Insert().Into(alias);
        IValList values = sql.ValList;

        // Get columns
        foreach (string column in engine.GetColumns(type))
        {
            // Ignore primary key and navigation properties
            if (column == primaryKey || column.Contains("."))
                continue;

            // Add column and value
            insert.Add(alias[column]);
            values.Add(type.GetProperty(column).GetValue(entity));
        }

        // Insert query
        IQuery query = sql.Query.Insert(insert).Values(values);

        // Compile and execute
        QueryResult result = engine.Compile(query);
        con.Execute(result.Sql, result.Parameters);

        // Get primary key
        query = sql.Query.Select(SqlFn.LastInsertId());

        // Compile and execute
        result = engine.Compile(query);
        int valuePK = con.ExecuteScalar<int>(result.Sql, result.Parameters);

        // Update property
        type.GetProperty(primaryKey).SetValue(entity, valuePK);

        return entity;
    }

    public T Update<T>(T entity)
    {
        Type type = typeof(T);
        string primaryKey = engine.GetPrimaryKeys(type)[0];
        IAlias<T> alias = sql.Alias<T>();

        // Update query
        IQuery query = sql.Query.Update()
            .From(alias)
            .Where(alias[primaryKey].Eq(type.GetProperty(primaryKey).GetValue(entity)));

        // Get columns
        foreach (string column in engine.GetColumns(type))
        {
            // Ignore primary key and navigation properties
            if (column == primaryKey || column.Contains("."))
                continue;

            // Set value
            query.Set(alias[column], type.GetProperty(column).GetValue(entity));
        }

        // Compile and execute
        QueryResult result = engine.Compile(query);
        con.Execute(result.Sql, result.Parameters);

        return entity;
    }

    public void Delete<T>(T entity)
    {
        Type type = typeof(T);
        string primaryKey = engine.GetPrimaryKeys(type)[0];
        IAlias<T> alias = sql.Alias<T>();

        // Delete query
        IQuery query = sql.Query
            .Delete()
            .From(alias)
            .Where(alias[primaryKey].Eq(type.GetProperty(primaryKey).GetValue(entity)));

        // Compile and execute
        QueryResult result = engine.Compile(query);
        con.Execute(result.Sql, result.Parameters);
    }
}
```