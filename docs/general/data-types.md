# Data types
You can use the **Type** method to create a SQL type:
```csharp
ISqlType type = sql.Type("INT");

ISqlType type = sql.Type("VARCHAR", 50);

ISqlType type = sql.Type("DECIMAL", 10, 2);
```

!!! warning
    Translation of type names is not currently supported.