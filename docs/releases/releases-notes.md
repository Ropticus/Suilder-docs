# Release notes

## 2.1.0
Add support for array values.

* `IEnumerable` values are no longer divided into multiple parameters.
* To add multiple parameters you have to use the `ISubList` interface.
* The **In** operator automatically adds the values to an `ISubList`.
* `Array` properties are not ignored by default.

## 2.0.0
Rewrite of the table builder:

* The table builder has been moved to the `Suilder.Reflection.Builder` namespace.
* Added support for nested types.
* Added support for custom metadata.
* Custom configuration processors can be added to the table builder.
* The **Add** method without arguments now returns an entity builder.
* Methods that change the default configuration have the **Default** prefix.
* The default inheritance configuration can be changed.
* Method **WithName** renamed to **TableName**.
* New **Property** method that allows to chain the property configuration.
* All methods provide overloads with a string argument for the property name instead of an expression.

Engine changes:

* The suffix **Engine** has been added to the engine names.
* Now you have to use the **GetInfo** method to get the configuration of a type. The rest of the methods have been removed.

## 1.2.1
* Fix lambda expressions that combine arithmetic and bit operators.

## 1.2.0
* Add raw **top** option in select, update and delete.
* Fix **Upper** function in `SqlExp`.

## 1.1.1
* Fix default **Cast** function in all engines.
* Fix **Ltrim** and **Rtrim** functions in MySQL when there is only one argument.

## 1.1.0
* Add support for insert multiple rows using select union all.
* Add dummy table for Oracle DB.
* Fix missing **Now** function in `SqlFn` and `SqlExp`.

## 1.0.0
* First version.