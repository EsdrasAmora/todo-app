env "local" {
  src = "./schema.hcl"
  dev = "postgresql://postgres_user:postgres_password@localhost:5432/todo_app_db?sslmode=disable"

  url = "postgresql://postgres_user:postgres_password@localhost:5432/todo_app_db?sslmode=disable"
  migration {
    dir = "file://migrations"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}
