# Functions
```csharp
IAlias person = sql.Alias("person");
Department dept = null;

IFunction fn1 = sql.Function("TRIM").Add(person["Name"]));

IFunction fn2 = sql.Function("SUBSTRING").Add(person["Name"], 1, 10);

IFunction fn3 = sql.Function("SUBSTRING").Add(() => dept.Name, () => 1, () => 10);
```

## Utilities classes
### SqlFn
This class allows you to create predefined functions that are registered by default in all supported engines:
```csharp
IAlias person = sql.Alias("person");

IFunction func1 = SqlFn.Trim(person["Name"]);

IFunction func2 = SqlFn.Substring(person["Name"], 1, 10);
```

For lambda expression you have to use the **Col** method:
```csharp
Department dept = null;
IFunction func = SqlFn.Substring(sql.Col(() => dept.Name, 1, 10);
```

> **Note**: to avoid this you can use the **SqlExp** utility class instead.

### SqlExp
Alternative class to `SqlFn` for lambda expressions:
```csharp
Person person = null;

IFunction func1 = sql.Val(() => SqlExp.Trim(person.Name));

IFunction func2 = sql.Val(() => SqlExp.Substring(person.Name, 1, 10));
```

It also implements some operators that allow comparisons of different types:
```csharp
Person person = null;
IAlias dept = sql.Alias("dept");

IOperator op = sql.Op(() => SqlExp.Eq(person.Department.Id, dept["Id"]);
```

## Register functions
You can register your functions in the [ExpressionProcessor](builder.md#expressionprocessor) to compile the lambda expressions to an `IQueryFragment`.

You can register your functions in your [engine](engines.md#register-functions) to translate them with a different name or compile to SQL with a custom delegate.

---
[<Previous](operators.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](select.md)