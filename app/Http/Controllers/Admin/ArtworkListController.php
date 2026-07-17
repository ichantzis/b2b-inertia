<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ArtworkList;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        $lists = ArtworkList::orderByDesc('last_change')->get();

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
        ]);

        // 1. Έλεγχος αν ο χρήστης ζήτησε τη διαγραφή της τρέχουσας custom εικόνας
        if ($request->boolean('remove_custom_cover')) {
            if ($artworkList->custom_cover_path) {
                Storage::disk('public')->delete($artworkList->custom_cover_path);
                $artworkList->custom_cover_path = null;
            }
        } 
        // 2. Αλλιώς, έλεγχος αν ανέβασε νέα εικόνα (η οποία θα αντικαταστήσει την παλιά)
        elseif ($request->hasFile('custom_cover')) {
            if ($artworkList->custom_cover_path) {
                Storage::disk('public')->delete($artworkList->custom_cover_path);
            }
            $path = $request->file('custom_cover')->store('lists_covers', 'public');
            $artworkList->custom_cover_path = $path;
        }

        // Αποθήκευση περιγραφής
        $artworkList->custom_description = $validated['custom_description'] ?? null;
        $artworkList->save();

        return back();
    }
}