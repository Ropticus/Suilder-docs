# Offset and limit
```csharp
// Add offset to the query
IOffset offset = sql.Offset(10).Fetch(20);
IQuery query1 = sql.Query.Offset(offset);

// Create offset
IQuery query2 = sql.Query
    .Offset(10).Fetch(20);
```

---
[<Previous](order-by.md) &nbsp;|&nbsp;  [Back to index](index.md) &nbsp;|&nbsp;  [Next>](insert.md)