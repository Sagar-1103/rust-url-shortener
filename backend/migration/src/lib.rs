pub use sea_orm_migration::prelude::*;

mod m20260717_224502_create_users_table;
mod m20260717_224504_create_urls_table;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260717_224502_create_users_table::Migration),
            Box::new(m20260717_224504_create_urls_table::Migration),
        ]
    }
}
