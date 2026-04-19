<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    /**
     * Display a listing of properties.
     */
    public function index()
    {
        $properties = Property::with('images')->where('status', 'active')->get();
        return response()->json($properties);
    }

    /**
     * Display the specified property.
     */
    public function show($id)
    {
        $property = Property::with('images')->findOrFail($id);
        return response()->json($property);
    }

    /**
     * Get availability dates for the next 30 days.
     */
    public function getAvailability($id)
    {
        $property = Property::findOrFail($id);
        
        // Get all active/confirmed bookings for this property
        $bookings = \App\Models\Booking::where('property_id', $id)
            ->where('status', '!=', 'cancelled')
            ->get(['check_in_date', 'check_out_date']);

        $availability = [];
        $startDate = now();
        
        for ($i = 0; $i < 30; $i++) {
            $currentDate = $startDate->copy()->addDays($i)->format('Y-m-d');
            $isBooked = false;

            foreach ($bookings as $booking) {
                if ($currentDate >= $booking->check_in_date && $currentDate < $booking->check_out_date) {
                    $isBooked = true;
                    break;
                }
            }

            $availability[] = [
                'date' => $currentDate,
                'is_available' => !$isBooked
            ];
        }

        return response()->json($availability);
    }
}
