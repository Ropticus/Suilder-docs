# Functions
```csharp
IAlias person = sql.Alias("person");
Department dept = null;

IFunction func1 = sql.Function("TRIM").Add(person["Name"]);

IFunction func2 = sql.Function("SUBSTRING").Add(person["Name"], 1, 10);

IFunction func3 = sql.Function("SUBSTRING").Add(() => dept.Name, () => 1, () => 10);
```

## Utility classes

### SqlFn
This class allows you to create predefined functions that are registered by default in all supported engines:
```csharp
IAlias person = sql.Alias("person");

IFunction func1 = SqlFn.Trim(person["Name"]);

IFunction func2 = SqlFn.Substring(person["Name"], 1, 10);
```

For lambda expression you have to use the **Col** method:
```csharp
Person person = null;
IFunction func = SqlFn.Substring(sql.Col(() => person.Name), 1, 10);
```

!!! tip
    To avoid this you can use the **SqlExp** utility class instead.

### SqlExp
Alternative class to `SqlFn` for lambda expressions:
```csharp
Person person = null;

IFunction func1 = sql.Val(() => SqlExp.Trim(person.Name));

IFunction func2 = sql.Val(() => SqlExp.Substring(person.Name, 1, 10));
```

## Register functions

### In your engine
You can register your functions in your [engine](../configuration/engines.md#register-functions) to translate them with a different name or compile to SQL with a custom delegate.

### For lambda expressions
You can register your functions in the [ExpressionProcessor](builder.md#register-functions) to compile the lambda expressions to an `IQueryFragment`.

#### Registered system functions
The following system functions are registered by default:

| Function | SQL |
|----------|-----|
| `string.StartsWith` | LIKE 'Value%' |
| `string.EndsWith` | LIKE '%Value' |
| `string.Contains` | LIKE '%Value%' |

!!! tip
    Use `SqlExp.Initialize(false)` if you do not want to register system functions.