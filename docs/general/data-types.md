# Data types
You can use the **Type** method to create a SQL type:
```csharp
ISqlType type1 = sql.Type("INT");

ISqlType type2 = sql.Type("VARCHAR", 50);

ISqlType type3 = sql.Type("DECIMAL", 10, 2);
```

!!! warning
    Translation of type names is not currently supported.