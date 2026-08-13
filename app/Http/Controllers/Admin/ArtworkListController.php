<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArtworkList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class ArtworkListController extends Controller
{
    /**
     * Εμφανίζει τη λίστα με όλες τις συλλογές στο Admin Panel.
     */
    public function index()
    {
        // Φέρνουμε όλες τις λίστες. Τα resolved_cover και resolved_description 
        // θα προστεθούν αυτόματα χάρη στα Accessors που φτιάξαμε προηγουμένως.
        $lists = ArtworkList::orderBy('sort_order')->orderByDesc('last_change')->get();

        return Inertia::render('dashboard/settings/Lists', [
            'lists' => $lists
        ]);
    }

    /**
     * Ενημερώνει τη συγκεκριμένη λίστα.
     */
    public function update(Request $request, ArtworkList $artworkList)
    {
        $validated = $request->validate([
            'custom_description' => 'nullable|string',
            'custom_cover' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'remove_custom_cover' => 'nullable|boolean',
            'custom_banner' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            'remove_custom_banner' => 'nullable|boolean',
        ]);

        // --- ΔΙΑΧΕΙΡΙΣΗ COVER ---
        if ($request->boolean('remove_custom_cover')) {
            if ($artworkList->custom_cover_path) {
                Storage::disk('public')->delete($artworkList->custom_cover_path);
                $artworkList->custom_cover_path = null;
            }
        } elseif ($request->hasFile('custom_cover')) {
            if ($artworkList->custom_cover_path) {
                Storage::disk('public')->delete($artworkList->custom_cover_path);
            }
            $path = $request->file('custom_cover')->store('lists_covers', 'public');
            $artworkList->custom_cover_path = $path;
        }

        // --- ΔΙΑΧΕΙΡΙΣΗ BANNER ---
        if ($request->boolean('remove_custom_banner')) {
            if ($artworkList->custom_banner_path) {
                Storage::disk('public')->delete($artworkList->custom_banner_path);
                $artworkList->custom_banner_path = null;
            }
        } elseif ($request->hasFile('custom_banner')) {
            if ($artworkList->custom_banner_path) {
                Storage::disk('public')->delete($artworkList->custom_banner_path);
            }
            // Αποθήκευση σε νέο υποφάκελο για τα banners
            $path = $request->file('custom_banner')->store('lists_banners', 'public');
            $artworkList->custom_banner_path = $path;
        }

        // Αποθήκευση περιγραφής και αλλαγών στη βάση
        $artworkList->custom_description = $validated['custom_description'] ?? null;
        $artworkList->save();

        // Καθαρισμός της Cache του μενού!
        Cache::forget('global_menu_data');

        return back();
    }

    /**
     * Ενημερώνει τη σειρά ταξινόμησης των λιστών.
     */
    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:artwork_lists,id',
        ]);

        // Η θέση στο array (index) γίνεται το νέο sort_order
        foreach ($validated['ids'] as $index => $id) {
            ArtworkList::where('id', $id)->update(['sort_order' => $index]);
        }

        Cache::forget('global_menu_data');

        return back();
    }
}
