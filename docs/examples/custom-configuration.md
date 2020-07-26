# Custom configuration
In the previous example we can see that we need to reverse the column names dictionary to map the result of a query:
```csharp
// We can have multiple properties mapped to the same column
ILookup<string, string> columnsLookup = tableInfo.ColumnNamesDic
    .ToLookup(x => x.Value.ToLower(), x => x.Key);
```

We can cache data like this, saving it as metadata. To do this we need to implement a custom [configuration processor](../configuration/entity-classes.md#configuration-processors):
```csharp
public class LookupProcessor : BaseConfigProcessor, IConfigProcessor
{
    protected override void ProcessData()
    {
        // Loop through all types that are a table
        foreach (TableConfig tableConfig in ConfigData.ConfigTypes.Values.Where(x => x.IsTable == true))
        {
            // Get the result class
            TableInfo tableInfo = ResultData.GetConfig(tableConfig.Type);

            // Add custom data as table metadata
            tableInfo.TableMetadata.Add("ColumnsLookup", tableInfo.ColumnNamesDic
                .ToLookup(x => x.Value.ToLower(), x => x.Key));
        }
    }
}
```

Then we need to register our processor:
```csharp
ITableBuilder tableBuilder = new TableBuilder();
tableBuilder.AddProcessor(new LookupProcessor());
```

And we can get the data like this:
```csharp
ILookup<string, string> columnsLookup = tableInfo
    .GetTableMetadata<ILookup<string, string>>("ColumnsLookup");
```