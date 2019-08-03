# The builder
In Suilder the queries are built by combining smaller query fragments. A query fragment is an object that implements the interface `IQueryFragment` and can be compiled to SQL. To create any `IQueryFragment` we use the methods of the `ISqlBuilder` interface.

For any method of the builder or an `IQueryFragment`, that accept an `object` as argument, anything that not implements the `IQueryFragment` interface, is interpreted as a **literal value** and added as a parameter.

For example, if you pass a **string**, is added as a **string literal** parameter and not a column name. To reference a table or column name you must use an [**alias object**](#alias-objects).

## Create the builder
You have to create a builder instance and register globally:
```csharp
//Register your builder (only one per application because is registered globally)
ISqlBuilder sql = SqlBuilder.Register(new SqlBuilder());
```

Only **one builder** can be registered **per application** because the builder is registered globally in the `SqlBuilder.Instance` static variable. This variable allows to any `IQueryFragment` and **static utilities** classes to access the builder instance without the needed to inject to it. For the rest of your classes it is recommended that you inject the `ISqlBuilder` interface instead.

> **Note:** you can inherit the builder to add more methods, and override any existing method.

## Alias objects
**Alias objects** implements the interface `IAlias`, and is both the table and his alias. With an alias you can create an `IColumn` instance that contains the column name:
```csharp
//Create an alias
IAlias person = sql.Alias("person");
IAlias<Department> dept = sql.Alias<Department>();

//Get a column
IColumn col1 = person["Name"];
IColumn col2 = dept[x => x.Name];

//Get all columns
IColumn colAll1 = person.All; //person["*"]; it works too
IColumn colAll2 = dept.All; //dept[x => x]; it works too

//Operator
IOperator op = dept[x => x.Id].Eq(person["DepartmentId"]);

//Select
ISelect select = sql.Select.Add(person["Id"], person["Name"]);

//From
IFrom from = sql.From(person);

//Join
IJoin join = sql.Join(dept).On(op);
```
> **Note**: the **typed alias** can also use a string for column names.

## Lambda expressions
Lambda expressions are compiled to an `IQueryFragment`. When you use your **entity classes** in an expression, is compiled to an `IAlias<T>` or an `IColumn`.

Any member of a class that is not registered as a table, is invoked and added as a parameter value. Functions are also executed, if you want to compile a function to SQL, you can [register your functions](engines.md#register-functions).

The following methods of the builder allow you to compile a lambda expression:
* **Alias**: compile to an alias instance (`IAlias<T>`).
* **Col**: compile to a column instance (`IColumn`).
* **Val**: compile to a value, anything that returns a value like a column (`IColumn`), a function, or an arithmetic operator.
* **Op**: compile a boolean expression to a boolean operator.

> **Note**: in most cases you do not need to call these methods because other components accept a lambda expression and compile for you with the correct method.

```csharp
//Class alias
Person person = null;
Department dept = null;

//Create an alias
IAlias alias1 = sql.Alias(() => person);

//Get a column
IColumn col1 = sql.Col(() => person.Name);

//Get all columns
IColumn colAll1 = sql.Col(() => person);

//The "Val" method can be used for columns too
IColumn col2 = (IColumn)sql.Val(() => dept.Name);

//Arithmetic operators use the "Val" method and not the "Op" method
IOperator func = (IOperator)sql.Val(() => person.Salary + 100);

//Boolean operators use the "Op" method
IOperator op = sql.Op(() => person.Department.Id == dept.Id);

//Select
ISelect select = sql.Select.Add(() => person.Id, () => person.Name);

//From
IFrom from = sql.From(() => person);

//Join
IJoin join = sql.Join(() => dept).On(op);
```

## Without alias
It's also possible to write queries without declaring an `IAlias` object.

```csharp
//Get a column
IColumn col1 = sql.Col("person.Id");
IColumn col2 = sql.Col("person", "Id");

//Get all columns
IColumn col7 = sql.Col("person.*");
IColumn col8 = sql.Col("person", "*");

//Select
ISelect select = sql.Select.Add(sql.Col("person.Id"), sql.Col("person.Name"));

//From
IFrom from = sql.From("person");

//Join
IJoin join = sql.Join("department", "dept");
```

## Compile the query
To compile the query you need an [engine](engines.md) and call his **Compile** method:
```csharp
//Create your query
IAlias person = sql.Alias("person");
IQueryFragment query = sql.Query
    .Select(person.All)
    .From(person)
    .Where(person["Id"].Eq(1));

//Compile the query using the engine
QueryResult result = engine.Compile(query);

//This is the SQL result
result.Sql; //SELECT "person".* FROM "person" WHERE "person"."Id" = @p0

//This is a dictionary with the parameters
result.Parameters; //{ ["@p0"] = 1 }
```

## Utilities classes
There are the following static utility classes:

### SqlExtensions
Contains extension methods of some operators.
```csharp
using Suilder.Extensions;
```

### SqlFn
This class allows you to create predefined functions that are registered by default in all supported engines. See [examples](functions.md#sqlfn).

### SqlExp
Alternative class to `SqlFn` for lambda expressions. It also implements some operators that allow comparisons of different types. See [examples](functions.md#sqlexp).

Before using it you must initialize the class:
```csharp
//Initialize the SqlExp class to use their functions in lambda expressions
SqlExp.Initialize();
```

> **Note**: The functions are registered in the **ExpressionProcessor** class.

### ExpressionProcessor
This class is responsible for compiling the lambda expressions.

You can register your functions to compile them to an `IQueryFragment`:
```csharp
//It is registered as "SUBSTRING"
ExpressionProcessor.AddFunction(typeof(SqlExp), nameof(SqlExp.Substring));

//Register with custom name
ExpressionProcessor.AddFunction(typeof(SqlExp), nameof(SqlExp.Substring), "SUBSTR");

//Register instance function
ExpressionProcessor.AddFunction(typeof(String), nameof(String.Trim), "TRIM");
```

For functions with a **params argument** the value is added as an array value. To avoid this you have to set the **isParams** parameter to true.
```csharp
ExpressionProcessor.AddFunction(typeof(SqlExp), nameof(SqlExp.Concat), true);
```

For more complex functions you can pass a delegate:
```csharp
//Create a like operator instead of a function
ExpressionProcessor.AddFunction(typeof(String), nameof(String.Contains), (expression) =>
{
    if (expression.Object == null || expression.Arguments.Count != 1)
        throw new ArgumentException("Invalid expression");

    return SqlBuilder.Instance.Like(SqlBuilder.Instance.Val(expression.Object),
        SqlBuilder.Instance.ToLikeAny((string)SqlBuilder.Instance.Val(expression.Arguments[0])));
});
```

## Custom components
You can add your custom components implementing the interface `IQueryFragment`.

Implement the interface is very easy, you only have to implement the **Compile** method:
```csharp
public virtual void Compile(QueryBuilder queryBuilder, IEngine engine)
{
    //Write SQL (don't use for values to prevent SQL injection)
    queryBuilder.Write("SELECT ");

    //Write a IQueryFragment or add parameter value
    queryBuilder.WriteValue(Value);

    //Write a IQueryFrament
    queryBuilder.WriteFragment(Value);

    //Add a parameter value
    queryBuilder.AddParameter(10);

    //Write a table or column name escaped
    queryBuilder.WriteName(ColumnName);

    //Remove the last characters
    queryBuilder.RemoveLast(2);

    //You can check the options of the engine
    switch(engine.Options.Pagination)
    {
        ...
    }
}
```

---
[<Previous](engines.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](operators.md)