# Backend App

Follow the steps in the root [README.md](../../README.md) to run the code.

## arch

This app is inspired by clean architecture, but more pragmatic on some implementation details.
Some attention points:

1. All use cases are placed in the root of the `./src/domain` folder.
   1. These use static classes to be able to use decorators (in the future) and provide namespacing.
   1. Declare its input as a zod schema for runtime validation.
1. Prefer colocation, only create abstractions when necessary, after 3 or more uses as a rule of thumb. (eg. models, database queries, utils)
1. Avoid nesting in the file tree, prefer flat structures. (You probably don't need to create new directories)
   1. if you do, place it in the root (`./src`) if it's used in many places or in the `./src/shared` if it's not used that often.
1. Avoid barrel exports to improve startup time and circular dependencies
1. Use zod in the "borders" of the app to remove type assertions.

## Libraries Highlights

1. trpc - Typesafe RPC without codegen.
1. zod - Runtime and compile time schema validation.
1. kysely - Typesafe SQL query builder.
