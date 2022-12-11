# Entity classes
You can use your entity classes to build the queries, this allows you to translate the tables and column names, and build strongly typed queries. Your classes equals an alias of a table, and works in the same manner that a SQL alias.

This means that there are some restrictions when you use a property of a class in a query:

- The property must exist as a column in the table, you cannot navigate to columns of other tables, you must do a join and use the property of the joined table.
- You can use navigation properties for foreign keys, because the foreign key is a column of your table.
- You cannot use inverse properties, because the column belongs to another table.
- You cannot use navigation lists, because these are inverse properties.

!!! note
    These restrictions are only for building the queries, you can use any property for mapping the results.

## Table builder
You have to use the `ITableBuilder` object to configure your classes. You can add classes that are not a table, like an **abstract** class, to share the same configuration with all derived classes. After you finish to register all your classes pass your `ITableBuilder` to an engine:
```csharp
// Create a table builder and add your entity classes
ITableBuilder tableBuilder = new TableBuilder();
tableBuilder.Add<Person>();
tableBuilder.Add<Department>();

// Create an engine with the table builder
IEngine engine = new Engine(tableBuilder);
```
!!! tip
    If you have multiple engines and need different configurations for each one, you can create multiple `ITableBuilder`.

## Inheritance patterns
The inheritance patterns work different in Suilder, because it never generates automatically any SQL clause depending on your class structure. Each class is mapped to only one table and it works like an alias of the table.

There are 3 properties to configure the inheritance:

- **IsTable**: if true, the class is added as a table, else, is only used to inherit the configuration for derived classes. By default is **false** for **abstract** classes.
- **InheritColumns**: if the class must inherit the columns of the base class. By default is **true** for classes whose base type is **abstract**.
- **InheritTable**: if the class must inherit the table name and the columns of the base class. By default is **false**.

With these properties you can emulate the most common patterns like, Table per concrete type (TPC), Table per type (TPT) and Table per hierarchy (TPH).

For the following examples, we use this inheritance structure:
```
      BaseConfig
      /        \
   Person   Department
    /
Employee
```

```csharp
public abstract class BaseConfig
{
    // Default primary key
    public int Id { get; set; }

    public string Guid { get; set; }

    public string Name { get; set; }
}

public class Department : BaseConfig
{
    // Foreign key
    public Employee Boss { get; set; }

    // Navigation lists are ignored
    public List<Employee> Employees { get; set; }

    // Array column
    public List<string> Tags { get; set; }
}

public class Person : BaseConfig
{
    public string SurName { get; set; }

    // Properties without getter and setter are ignored
    public string FullName => $"{Name} {SurName}".TrimEnd();

    // Nested properties
    public Address Address { get; set; }
}

public class Employee : Person
{
    public decimal Salary { get; set; }

    // Foreign key
    public int DepartmentId { get; set; }

    // Foreign key
    public Department Department { get; set; }

    // Binary column
    public byte[] Image { get; set; }
}

// This is a nested class
[Nested]
public class Address
{
    public string Street { get; set; }

    public string City { get; set; }
}
```

### Table per concrete type (TPC)
To use the TPC pattern, you have to set the following configuration:

- Set **IsTable** to **false** for `BaseConfig` class.
- Set **InheritColumns** to **true** for `Person` and `Department` class.

This is **done by default** if the class `BaseConfig` is **abstract**.

### Table per type (TPT)
To use the TPT pattern, you have to set the following configuration:

- Set **InheritColumns** to **false** for `Employee` class.

This is the **default configuration** for classes that inherit a **non abstract** class.

!!! warning
    If you use the `Employee` class, you only get the columns of the `Employee` table. You have to add a join with the `Person` class, like you would do in SQL.

### Table per hierarchy
To use the TPH pattern, you have to set the following configuration:

- Set **InheritTable** to **true** for `Employee` class.

This **can be the default configuration** if you set `DefaultInheritTable` to true

!!! warning
    If you use the `Employee` class, you get both, the rows of `Employee` and `Person`. You have to add a where clause with your column discriminator, like you would do in SQL, to only get the `Employee` type.

## Configuration
You can use **attributes** or the **Add** method of the `ITableBuilder` to set the configuration of the class.

The **attributes** have the limitation that you cannot have multiple configurations for different engines.
The **Add** method has more precedence and overrides the configuration of the attributes.

### Conventions
The following conventions are used by default:

#### Table and column names

- The schema name is empty.
- The table name is the name of the class.
- The column name is the name of the property.
- Nested properties use the concatenation of all properties as name. For example: `Address.Street` -> `"AddressStreet"`.

#### Primary key

- The primary key is the **Id** property if exists in the class.

#### Foreign keys

- If a property is another table, is used as foreign key.
- By default it uses the primary keys of the other table, concatenating the name of the property and primary key property. For example: `Department.Id` -> `"DepartmentId"`.

#### Supported properties

- Only public properties with a getter and setter are added as columns.
- `IEnumerable<T>` properties where **T** is another table are ignored.

!!! warning
    Remember that you can not use inverse properties, so if you have a reverse one to one property, you have to mark that property as [ignored](#ignore-property).

### Default config
You can change some of the default conventions.

Default schema name:
```csharp
tableBuilder.DefaultSchema(x => "dbo");
```

Default table name:
```csharp
tableBuilder.DefaultTableName(x => $"prefix_{x.Name}");
```

Default primary key property:
```csharp
tableBuilder.DefaultPrimaryKey(x => x.GetProperty("Guid")?.Name);
```

Default **InheritTable**:
```csharp
tableBuilder.DefaultInheritTable(true);

// You can also use an expression
tableBuilder.DefaultInheritTable(x => !x.IsAbstract && !x.BaseType.IsAbstract);
```

Default **InheritColumns**:
```csharp
tableBuilder.DefaultInheritColumns(x => x.BaseType.IsAbstract);
```

### Table config
These parameters control the inheritance patterns.

With attribute:
```csharp
[Table(IsTable = false)]
public class BaseConfig {...}

[Table(InheritColumns = true)]
public class Person : BaseConfig {...}

[Table(InheritTable = true)]
public class Employee : Person {...}
```

With table builder:
```csharp
tableBuilder.Add<BaseConfig>()
    .IsTable(false);

tableBuilder.Add<Person>()
    .InheritColumns(false);

tableBuilder.Add<Employee>()
    .InheritTable(false);
```

### Nested classes
Nested classes allow you to organize properties and they work just like normal properties. You can have multiple nested levels.

With attribute:
```csharp
[Nested]
public class Address
```

With table builder:
```csharp
tableBuilder.AddNested<Address>();
```

!!! warning
    A nested class **cannot have circular references** with other nested class, you must [ignore](#ignore-property) the properties that cause a circular reference. A reference to an entity class does not cause a circular reference because is mapped as a foreign key.

### Schema name
With attribute:
```csharp
[Table(Schema = "dbo")]
public class Department
```

With table builder:
```csharp
tableBuilder.Add<Department>()
    .Schema("dbo");
```

### Table name
With attribute:
```csharp
[Table("Dept")]
public class Department
```

With table builder:
```csharp
tableBuilder.Add<Department>()
    .TableName("Dept");
```

### Primary key
With attribute:
```csharp
[PrimaryKey]
public string Guid { get; set; }
```

With table builder:
```csharp
tableBuilder.Add<Person>()
    .PrimaryKey(x => x.Guid);
```

#### Composite key
With attribute:
```csharp
[PrimaryKey(1)]
public int Id { get; set; }

[PrimaryKey(2)]
public string Guid { get; set; }
```

With table builder:
```csharp
tableBuilder.Add<Person>()
    .PrimaryKey(x => x.Id)
    .PrimaryKey(x => x.Guid);
```

### Column name
With attribute:
```csharp
[Column("LastName")]
public string SurName { get; set; }

// Change the prefix of all nested properties
[Column("Addr")]
public Address Address { get; set; }

// Change the full name of a nested property
[Column("Street")]
public string Street { get; set; }
```

With table builder:
```csharp
tableBuilder.Add<Person>()
    .ColumnName(x => x.SurName, "LastName");

// Change the prefix of all nested properties
tableBuilder.Add<Person>()
    .ColumnName(x => x.Address, "Addr");

// Change the full name of a nested property
tableBuilder.Add<Person>()
    .ColumnName(x => x.Address.Street, "Street");
```

### Foreign key
```csharp
// Change the name of the foreign key
[ForeignKey("DeptId")]
public Department Department { get; set; }

// Change the property of the foreign key
[ForeignKey(PropertyName = "Guid")]
public Department Department { get; set; }

// Change the property and name of the foreign key
[ForeignKey("Guid", "DeptGuid")]
public Department Department { get; set; }

// You can use the "Column" attribute to set the name.
[ForeignKey(PropertyName = "Guid")]
[Column("DeptGuid")]
public Department Department { get; set; }

// Mark primitive property as foreign key
[ForeignKey]
public int DepartmentId { get; set; }

// Change the name of the foreign key
[ForeignKey("DeptId")]
public int DepartmentId { get; set; }
```

With table builder:
```csharp
// Change the name of the foreign key
tableBuilder.Add<Person>()
    .ForeignKey(x => x.Department, "DeptId");

// Change the property of the foreign key
tableBuilder.Add<Person>()
    .ForeignKey(x => x.Department.Guid);

// Change the property and name of the foreign key
tableBuilder.Add<Person>()
    .ForeignKey(x => x.Department.Guid, "DeptGuid");

// You can use the "ColumnName" method to set the name.
tableBuilder.Add<Person>()
    .ForeignKey(x => x.Department.Guid)
    .ColumnName(x => x.Department.Guid, "DeptGuid");

// Mark primitive property as foreign key
tableBuilder.Add<Person>()
    .ForeignKey(x => x.DepartmentId);

// Change the name of the foreign key
tableBuilder.Add<Person>()
    .ForeignKey(x => x.DepartmentId, "DeptId");
```

#### Composite key
With attribute:
```csharp
[ForeignKey("Id")]
[ForeignKey("Guid", "DeptGuid")]
public Department Department { get; set; }
```

With table builder:
```csharp
tableBuilder.Add<Person>()
    .ForeignKey(x => x.Department.Id)
    .ForeignKey(x => x.Department.Guid, "DeptGuid");
```

### Ignore property
With attribute:
```csharp
[Ignore]
public string SurName { get; set; }
```

With table builder:
```csharp
tableBuilder.Add<Person>()
    .Ignore(x => x.SurName);
```

### Custom metadata
You can add your own metadata to the configuration. These can be used to build more features on top of **Suilder**.

By default metadata is not processed, you need to add a [metadata processor](#configuration-processors) to the table builder.
```csharp
tableBuilder.AddProcessor(new DefaultMetadataProcessor());
```

Metadata is a collection of keys and values, there are two types of metadata:

#### Table metadata
These metadata belong to the class:
```csharp
// Add metadata
tableBuilder.Add<Person>()
    .AddTableMetadata("Collate", "UTF-8");

// Remove metadata
tableBuilder.Add<Person>()
    .RemoveTableMetadata("Collate");
```

#### Member metadata
These metadata belong to a member of a class. You can add metadata to any property, even ignored properties. Actually the member metadata are values with two keys, where the first is the name of the member, any key can be used even if the member does not exist:
```csharp
// Add metadata
tableBuilder.Add<Person>()
    .AddMetadata(x => x.Id, "Autoincrement", true);

// Remove metadata
tableBuilder.Add<Person>()
    .RemoveMetadata(x => x.Id, "Autoincrement");
```

!!! note
    Although you can only add metadata through the table builder, you can create your custom attributes and an [attribute processor](#implement-a-configuration-processor) that reads these attributes.

!!! tip
    If you are creating a library that use custom metadata, it is a good idea to prefix your key names with your namespace, to avoid conflicts with other libraries and the user's keys. You can also create your custom methods using extension methods.

### Chain property configuration
You can use the **Property** method to chain configuration of the same property:
```csharp
tableBuilder.Add<Person>()
    .Property(x => x.Id)
    .PrimaryKey()
    .ColumnName("Id")
    .AddMetadata("Autoincrement", true);

// Use an expression to chain multiple properties
tableBuilder.Add<Person>()
    .Property(x => x.Id, p => p
        .PrimaryKey()
        .ColumnName("Id")
        .AddMetadata("Autoincrement", true))
    .Property(x => x.Department.Id, p => p
        .ForeignKey()
        .ColumnName("DeptId"));
```

### String properties
All methods provide overloads with a string argument for the property name instead of an expression:
```csharp
tableBuilder.Add(typeof(Person))
    .PrimaryKey("Id");
    .ColumnName("SurName", "LastName");
    .ColumnName("Address.Street", "Street")
    .ForeignKey("Department.Id", "DeptId")
    .AddMetadata("Id", "Autoincrement", true);
```

## Configuration processors
The configuration is processed through multiple **configuration processors**. You can add your custom processors and even remove existing ones. This allows you, for example, to process your custom attributes or metadata.

By default the following processors are added to the table builder:

- **DefaultPropertyProcessor**: It reads and loads the properties of all registered types, allowing the following processors to read all the properties by looping through a single list. The [Nested](#nested-classes) and [Ignore](#ignore-property) attributes are processed here because it affects the properties to load.
- **DefaultAttributeProcessor**: It reads and loads the configuration of the attributes.
- **DefaultConfigProcessor**: It processes the configuration of the tables. This does not include metadata.

Keep in mind that the order is important. For example, if you want to add your own attribute processor, you have to remove all processors, and add them in the correct order:
```csharp
tableBuilder.ClearProcessors();
tableBuilder.AddProcessor(new DefaultPropertyProcessor());
tableBuilder.AddProcessor(new DefaultAttributeProcessor());
// Your attribute processor
tableBuilder.AddProcessor(new MyAttributeProcessor());
tableBuilder.AddProcessor(new DefaultConfigProcessor());
```

To process the metadata you have to add a metadata processor. You can create your own [metadata processor](#implement-a-configuration-processor) or use the [DefaultMetadataProcessor](#default-metadata-processor):
```csharp
tableBuilder.AddProcessor(new DefaultMetadataProcessor());
```

If you want to add metadata through attributes you have to create your own [attribute processor](#implement-a-configuration-processor). In this case your attribute processor only needs to be added before the metadata processor.
```csharp
// Your attribute processor
tableBuilder.AddProcessor(new MyAttributeMetadataProcessor());
tableBuilder.AddProcessor(new DefaultMetadataProcessor());
```

You can also enable or disable the attribute and metadata processors:
```csharp
// Disable attributes
tableBuilder.DisableAttributes();

// Disable metadata
tableBuilder.DisableMetadata();
```

!!! note
    The [Nested](#nested-classes) attribute is considered a special attribute and is never disabled.

### Default metadata processor
The **DefaultMetadataProcessor** can be used for simple metadata, where a collection of keys and values is sufficient, and you do not need to transform the metadata into another data structure.

This processor uses the following rules:

- Table metadata is only inherit if **InheritTable** is `true`.
- Member metadata is only inherit if **InheritColumns** is `true`.
- It processes the metadata of all members, even if they are [ignored](#ignore-property).

It offers some options to alter the way some keys are inherited or ignored:
```csharp
DefaultMetadataProcessor metadataProcessor = new DefaultMetadataProcessor();

// Inherit all keys
metadataProcessor.InheritAll(true);

// Inherit all table metadata keys
metadataProcessor.InheritAllTable(true);

// Inherit all member metadata keys
metadataProcessor.InheritAllMembers(true);

// Inherit always some keys
metadataProcessor.InheritAlways("Autoincrement");

// Ignore some keys
metadataProcessor.Ignore("Custom.Key1", "Custom.Key2");

// Ignore some keys using an expression
metadataProcessor.Ignore(x => x.StartsWith("Custom."));
```

!!! tip
    If you have multiple metadata processors, use the **Ignore** method to skip the keys that this processor should not read.

### Implement a configuration processor
To create your own **configuration processor** you have to implement the `IConfigProcessor` interface. You can also inherit the `BaseConfigProcessor` class that offers some useful methods.

You receive two classes to process the configuration:

- **ConfigData**: contains the configuration data, you have to read from this class.
- **ResultData**: contains the result of the configuration, you have to write into this class.

!!! note
    You can also write in the `ConfigData` class to load the configuration of the attributes.

The `ConfigData` class has the properties **EnableAttributes** and **EnableMetadata**, you can use these values to know if your processor should be executed. Alternatively, you can implement the `IAttributeProcessor` and `IMetadataProcessor` interfaces, that are automatically enabled or disabled based on the previous values.

The best way to understand how to create a configuration processor is to read the [source code](https://github.com/Ropticus/Suilder/tree/master/Suilder/Reflection/Builder/Processors) of the processors already implemented. Most of them use a code structure similar to the following:
```csharp
protected override void ProcessData()
{
    var levels = GroupByInheranceLevel(ConfigData.ConfigTypes.Values);

    // Loop by inheritance level
    foreach (var level in levels)
    {
        // Loop through the configuration of the classes
        foreach (TableConfig tableConfig in level)
        {
            // Get the result class
            TableInfo tableInfo = ResultData.GetConfig(tableConfig.Type);

            // Get the result of the parent class
            TableInfo parentInfo = ResultData.GetParentConfig(tableConfig.Type);

            // Your methods that process the configuration
            LoadData1(tableConfig, tableInfo, parentInfo);
            LoadData2(tableConfig, tableInfo, parentInfo);
        }
    }
}

protected void LoadData1(TableConfig tableConfig, TableInfo tableInfo, TableInfo parentInfo)
{
    // Your code implementation
    // 1. Read data from "tableConfig"
    // 2. Write the result into "tableInfo"
    // 3. Use "tableConfig.InheritTable" or "tableConfig.InheritColumns" to determine
    // if you should inherit the result of "parentInfo"
}
```

## About select all
When you use a **select all** for an alias of an entity class, it selects only the registered columns. The order of the columns is **arbitrary**, but the primary keys are always added first. So you can, for example, use a **select all** in a **group by**, to group by the primary key and select the rest of the columns.