use sea_orm_migration::{prelude::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
        .alter_table(
            Table::alter()
                .table(Url::Table)
                .add_column_if_not_exists(
                    ColumnDef::new(Url::Title)
                        .string()
                )
                .add_column_if_not_exists(
                    ColumnDef::new(Url::Archived)
                        .boolean()
                        .not_null()
                        .default(false)
                ).to_owned()
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(Url::Table)
                    .drop_column(Url::Archived)
                    .drop_column(Url::Title)
                    .to_owned()
            ).await
    }
}

#[derive(DeriveIden)]
enum Url {
    Table,
    Title,
    Archived,
}
