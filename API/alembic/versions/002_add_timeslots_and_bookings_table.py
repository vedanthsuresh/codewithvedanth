"""add timeslots and bookings tables

Revision ID: 002_add_timeslots_bookings
Revises: 984e60fadaae
Create Date: 2026-08-05 01:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy import inspect

revision: str = '002_add_timeslots_bookings'
down_revision: Union[str, None] = '984e60fadaae'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Get the current connection
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    # Create time_slots table if it doesn't exist
    if 'time_slots' not in tables:
        op.create_table(
            'time_slots',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('date', sa.String(), nullable=False),
            sa.Column('time', sa.String(), nullable=False),
            sa.Column('capacity', sa.Integer(), nullable=False, server_default='1'),
            sa.Column('created_at', sa.String(), nullable=False),
            sa.Column('updated_at', sa.String(), nullable=False),
            sa.PrimaryKeyConstraint('id')
        )
        op.create_index(op.f('ix_time_slots_date'), 'time_slots', ['date'], unique=False)

    # Create bookings table if it doesn't exist
    if 'bookings' not in tables:
        op.create_table(
            'bookings',
            sa.Column('id', sa.String(), nullable=False),
            sa.Column('time_slot_id', sa.String(), nullable=False),
            sa.Column('user_id', sa.String(), nullable=False),
            sa.Column('student_name', sa.String(), nullable=False),
            sa.Column('student_email', sa.String(), nullable=False),
            sa.Column('student_phone', sa.String(), nullable=False),
            sa.Column('student_age', sa.Integer(), nullable=False),
            sa.Column('booked_at', sa.String(), nullable=False),
            sa.Column('status', sa.String(), nullable=False, server_default='confirmed'),
            sa.PrimaryKeyConstraint('id'),
            sa.ForeignKeyConstraint(['time_slot_id'], ['time_slots.id'])
        )
        op.create_index(op.f('ix_bookings_time_slot_id'), 'bookings', ['time_slot_id'], unique=False)
        op.create_index(op.f('ix_bookings_user_id'), 'bookings', ['user_id'], unique=False)
        op.create_index(op.f('ix_bookings_student_email'), 'bookings', ['student_email'], unique=False)


def downgrade() -> None:
    # Drop bookings table
    op.drop_index(op.f('ix_bookings_student_email'), table_name='bookings')
    op.drop_index(op.f('ix_bookings_user_id'), table_name='bookings')
    op.drop_index(op.f('ix_bookings_time_slot_id'), table_name='bookings')
    op.drop_table('bookings')

    # Drop time_slots table
    op.drop_index(op.f('ix_time_slots_date'), table_name='time_slots')
    op.drop_table('time_slots')
