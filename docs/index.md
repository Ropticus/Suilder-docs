# Suilder
[Suilder](https://github.com/Ropticus/Suilder) is a SQL query builder for .NET.

It is focused on the use of [**alias objects**](general/builder.md#alias-objects) to reference tables and column names, there are different types of alias, that can use strings or lambda expressions, and support translation of names. The queries are built by combining smaller query fragments, allowing us to build dynamic queries easily.

This library is only a query builder, so you have to combine with any other library to execute the queries and mapping the result.

## Installing

| Package | Nuget | Download (full) |
|---------|-------|-----------------|
| Suilder | [![Nuget](https://img.shields.io/nuget/v/Suilder?logo=nuget)](https://www.nuget.org/packages/Suilder/) | [![GitHub release](https://img.shields.io/github/release/Ropticus/Suilder?logo=github)](https://github.com/Ropticus/Suilder/releases/latest) |
| Suilder.Engines | [![Nuget](https://img.shields.io/nuget/v/Suilder.Engines?logo=nuget)](https://www.nuget.org/packages/Suilder.Engines/) | Use full release. |

## Configuration

- [Entity classes](configuration/entity-classes.md)
    - [Inheritance patterns](configuration/entity-classes.md#inheritance-patterns)
    - [Configuration](configuration/entity-classes.md#configuration)
- [Engines](configuration/engines.md)
    - [Supported engines](configuration/engines.md#supported-engines)
    - [Engine configuration](configuration/engines.md#engine-configuration)
    - [Register functions](configuration/engines.md#register-functions)

## General

- [The builder](general/builder.md)
    - [Alias and columns](general/builder.md#alias-objects)
    - [Lambda expressions](general/builder.md#lambda-expressions)
    - [Compile the query](general/builder.md#compile-the-query)
    - [Utilities classes](general/builder.md#utilities-classes)
    - [Custom components](general/builder.md#custom-components)
- [Operators](general/operators.md)
- [Case when](general/case-when.md)
- [Functions](general/functions.md)
- [Query](general/query.md)
- [Select](general/select.md)
- [From, join and CTE](general/from-join-cte.md)
- [Where and having](general/where-having.md)
- [Group by](general/group-by.md)
- [OrderBy](general/order-by.md)
- [Offset and limit](general/offset.md)
- [Insert](general/insert.md)
- [Update](general/update.md)
- [Delete](general/delete.md)
- [Raw SQL](general/raw-sql.md)
- [Data types](general/data-types.md)

## Examples

- [CRUD operations](examples/crud.md)
- [Custom configuration](examples/custom-configuration.md)

## Release notes
See [release notes](releases/releases-notes.md).