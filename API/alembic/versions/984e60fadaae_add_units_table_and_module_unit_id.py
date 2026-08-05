"""add units table and module unit_id

Revision ID: 984e60fadaae
Revises: c69203524496
Create Date: 2026-08-04 19:23:34.912514

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect
revision: str = '984e60fadaae'
down_revision: Union[str, None] = 'c69203524496'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Get the current connection
    conn = op.get_bind()

    # Check if units table already exists
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    if 'units' not in tables:
        # Create units table
        op.create_table(
            'units',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('path_id', sa.String(), nullable=False),
            sa.Column('title', sa.String(), nullable=False),
            sa.Column('description', sa.String(), nullable=False, server_default=''),
            sa.Column('order', sa.Integer(), nullable=False, server_default='0'),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_units_path_id'), 'units', ['path_id'], unique=False)

    # Check if modules table has unit_id and order columns
    modules_columns = [c['name'] for c in inspector.get_columns('modules')]

    if 'unit_id' not in modules_columns:
        op.add_column('modules', sa.Column('unit_id', sa.String(), nullable=True))

    if 'order' not in modules_columns:
        op.add_column('modules', sa.Column('order', sa.Integer(), nullable=False, server_default='0'))

    # Check if index exists
    indexes = inspector.get_indexes('modules')
    index_names = [i['name'] for i in indexes]

    if 'ix_modules_unit_id' not in index_names:
        op.create_index(op.f('ix_modules_unit_id'), 'modules', ['unit_id'], unique=False)


def downgrade() -> None:
    # Remove columns from modules
    op.drop_index(op.f('ix_modules_unit_id'), table_name='modules')
    op.drop_column('modules', 'order')
    op.drop_column('modules', 'unit_id')

    # Drop units table
    op.drop_index(op.f('ix_units_path_id'), table_name='units')
    op.drop_table('units')
