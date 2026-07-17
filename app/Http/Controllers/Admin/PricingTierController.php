<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingTier;
use Illuminate\Http\Request;

class PricingTierController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'discount_percentage' => 'required|numeric|min:0|max:100',
        ]);

        PricingTier::create($validated);

        return back()->with('success', 'Pricing tier created successfully.');
    }

    public function update(Request $request, PricingTier $pricingTier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'discount_percentage' => 'required|numeric|min:0|max:100',
        ]);

        $pricingTier->update($validated);

        return back()->with('success', 'Pricing tier updated successfully.');
    }

    public function destroy(PricingTier $pricingTier)
    {
        // Εάν θέλεις να προστατεύσεις Tiers που έχουν ήδη ανατεθεί σε χρήστες:
        if ($pricingTier->users()->exists()) {
            return back()->with('error', 'Cannot delete tier. It is assigned to users.');
        }

        $pricingTier->delete();

        return back()->with('success', 'Pricing tier deleted successfully.');
    }
}