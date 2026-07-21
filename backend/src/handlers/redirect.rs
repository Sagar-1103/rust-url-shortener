use axum::{ extract::{Path, State}, response::Redirect};
use migration::Expr;
use sea_orm::{ ColumnTrait, EntityTrait, QueryFilter};

use crate::{entities::{prelude::*, url}, state::AppState, utils::error::ApiError};

pub async fn redirect_url(State(state):State<AppState>,Path(code): Path<String>) -> Result<Redirect,ApiError> {
    let url = Url::find().filter(url::Column::Code.eq(&code)).one(&state.db).await.map_err(|_| ApiError::Internal)?.ok_or(ApiError::NotFound)?;

    let db = state.db.clone();

    if !url.archived {
        tokio::spawn(async move {
            let _ = Url::update_many()
                        .filter(url::Column::Code.eq(&code))
                        .col_expr(url::Column::ClickCount, Expr::col(url::Column::ClickCount).add(1))
                        .exec(&db)
                        .await;
        });
    }

    Ok(Redirect::permanent(&url.original_url))
}