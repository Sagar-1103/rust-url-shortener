use sea_orm_migration::{prelude::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Url::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Url::Id)
                            .uuid()
                            .not_null()
                            .primary_key()
                            .default(Expr::cust("gen_random_uuid()"))
                    )
                    .col(
                        ColumnDef::new(Url::Code)
                            .string()
                            .not_null()
                            .unique_key()
                    )
                    .col(
                        ColumnDef::new(Url::OriginalUrl)
                            .string()
                            .not_null()
                    )
                    .col(
                        ColumnDef::new(Url::UserId)
                            .uuid()
                            .not_null()   
                    )
                    .col(
                        ColumnDef::new(Url::ClickCount)
                            .integer()
                            .not_null()
                            .default(0)
                    )
                    .col(
                        ColumnDef::new(Url::ImageURL)
                            .string()
                    )
                    .col(
                        ColumnDef::new(Url::CreatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp())   
                    )
                    .col(
                        ColumnDef::new(Url::UpdatedAt)
                            .timestamp_with_time_zone()
                            .not_null()
                            .default(Expr::current_timestamp())
                    )
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_url_user_id")
                            .from(Url::Table, Url::UserId)
                            .to(User::Table,User::Id)
                            .on_delete(ForeignKeyAction::Cascade),
                    )
                .to_owned()
            ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(
                Table::drop()
                    .table(Url::Table)
                    .to_owned()
            ).await
    }
}

#[derive(DeriveIden)]
enum Url {
    Table,
    Id,
    Code,
    OriginalUrl,
    UserId,
    ImageURL,
    ClickCount,
    CreatedAt,
    UpdatedAt,
}

#[derive(DeriveIden)]
enum User {
    Table,
    Id,
}