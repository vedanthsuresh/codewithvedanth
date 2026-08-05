from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models import (
    TimeSlot, TimeSlotCreate, TimeSlotUpdate,
    Booking, BookingCreate, BookingResponse, BookingListAdmin
)
from app.database import get_db, db as database

router = APIRouter(prefix="/bookings", tags=["bookings"])


# ============ PUBLIC ENDPOINTS (No Auth Required) ============

@router.get("/slots", response_model=List[TimeSlot])
async def get_available_slots(
    available_only: bool = Query(default=True, description="Show only available slots"),
    db: Session = Depends(get_db)
):
    """Get available time slots for booking."""
    return database.get_all_time_slots(db, available_only=available_only)


@router.get("/slots/{slot_id}", response_model=TimeSlot)
async def get_slot(slot_id: str, db: Session = Depends(get_db)):
    """Get a specific time slot by ID."""
    slot = database.get_time_slot_by_id(db, slot_id)
    if not slot:
        raise HTTPException(status_code=404, detail="Time slot not found")
    return slot


@router.post("/slots/{slot_id}/book", response_model=BookingResponse, status_code=201)
async def book_slot(booking: BookingCreate, slot_id: str, db: Session = Depends(get_db)):
    """Book a free trial class."""
    try:
        booking_data = booking.model_dump()
        booking_data["time_slot_id"] = slot_id
        return database.create_booking(db, booking_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============ ADMIN ENDPOINTS ============

@router.get("/admin/slots", response_model=List[TimeSlot])
async def get_all_slots_admin(
    available_only: bool = Query(default=False, description="Filter by availability"),
    db: Session = Depends(get_db)
):
    """Admin: Get all time slots."""
    return database.get_all_time_slots(db, available_only=available_only)


@router.post("/admin/slots", response_model=TimeSlot, status_code=201)
async def create_slot(slot: TimeSlotCreate, db: Session = Depends(get_db)):
    """Admin: Create a new time slot."""
    try:
        return database.create_time_slot(db, slot.model_dump())
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/admin/slots/{slot_id}", response_model=TimeSlot)
async def update_slot(slot_id: str, updates: TimeSlotUpdate, db: Session = Depends(get_db)):
    """Admin: Update a time slot."""
    update_data = updates.model_dump(exclude_unset=True)
    if not update_data:
        return database.get_time_slot_by_id(db, slot_id)

    try:
        updated = database.update_time_slot(db, slot_id, update_data)
        if not updated:
            raise HTTPException(status_code=404, detail="Time slot not found")
        return updated
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/admin/slots/{slot_id}", status_code=204)
async def delete_slot(slot_id: str, db: Session = Depends(get_db)):
    """Admin: Delete a time slot."""
    try:
        if not database.delete_time_slot(db, slot_id):
            raise HTTPException(status_code=404, detail="Time slot not found")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return None


@router.get("/admin/bookings", response_model=List[BookingListAdmin])
async def get_all_bookings(db: Session = Depends(get_db)):
    """Admin: Get all bookings."""
    return database.get_all_bookings(db)


@router.put("/admin/bookings/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    status: str = Query(..., regex="^(confirmed|cancelled|completed)$"),
    db: Session = Depends(get_db)
):
    """Admin: Update booking status."""
    if not database.update_booking_status(db, booking_id, status):
        raise HTTPException(status_code=404, detail="Booking not found")
    return {"status": "updated", "booking_id": booking_id, "new_status": status}


@router.delete("/admin/bookings/{booking_id}", status_code=204)
async def delete_booking(booking_id: str, db: Session = Depends(get_db)):
    """Admin: Delete a booking."""
    if not database.delete_booking(db, booking_id):
        raise HTTPException(status_code=404, detail="Booking not found")
    return None


@router.get("/admin/bookings/slot/{slot_id}", response_model=List[BookingListAdmin])
async def get_bookings_for_slot_admin(slot_id: str, db: Session = Depends(get_db)):
    """Admin: Get all bookings for a specific time slot."""
    bookings = database.get_bookings_for_slot(db, slot_id)
    # Return with admin details
    result = []
    for b in bookings:
        from datetime import datetime
        booking_dict = b.model_dump()
        # Add booking count for this slot
        booking_dict['time_slot_date'] = booking_dict.get('time_slot_id', slot_id)
        booking_dict['time_slot_time'] = ""
        booking_dict['bookings_count'] = database.get_booking_count_for_slot(db, slot_id)
        result.append(BookingListAdmin(**booking_dict))
    return result
