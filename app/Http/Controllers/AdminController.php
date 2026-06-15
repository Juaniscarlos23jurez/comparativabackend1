<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function users(Request $request)
    {
        abort_unless($request->user()->role === 'super_admin', 403);
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(10)->withQueryString();

        return inertia('admin/users', [
            'users' => $users,
            'filters' => $request->only(['search'])
        ]);
    }

    public function statistics(Request $request)
    {
        abort_unless($request->user()->role === 'super_admin', 403);
        $totalUsers = User::count();
        $recentUsers = User::where('created_at', '>=', now()->subDays(30))->count();
        
        return inertia('admin/statistics', [
            'stats' => [
                'totalUsers' => $totalUsers,
                'recentUsers' => $recentUsers,
                // Mocking other stats for now since we don't have revenue or lookup history tables
                'totalRevenue' => 45231,
                'totalLookups' => 142000,
                'estSavings' => 1200000,
            ]
        ]);
    }

    public function activity(Request $request)
    {
        abort_unless($request->user()->role === 'super_admin', 403);
        return inertia('admin/activity');
    }

    public function reports(Request $request)
    {
        abort_unless($request->user()->role === 'super_admin', 403);
        return inertia('admin/reports');
    }

    public function version(Request $request)
    {
        abort_unless($request->user()->role === 'super_admin', 403);
        
        return inertia('admin/version', [
            'settings' => [
                'min_version' => \App\Models\Setting::getValue('min_version', env('APP_MIN_VERSION', '1.0.0')),
                'latest_version' => \App\Models\Setting::getValue('latest_version', env('APP_LATEST_VERSION', '1.0.0')),
                'app_store_url' => \App\Models\Setting::getValue('app_store_url', env('APP_STORE_URL', 'https://apps.apple.com/app/id123456789')),
                'play_store_url' => \App\Models\Setting::getValue('play_store_url', env('PLAY_STORE_URL', 'https://play.google.com/store/apps/details?id=com.example.app')),
            ]
        ]);
    }

    public function updateVersion(Request $request)
    {
        abort_unless($request->user()->role === 'super_admin', 403);
        
        $data = $request->validate([
            'min_version' => 'required|string',
            'latest_version' => 'required|string',
            'app_store_url' => 'required|url',
            'play_store_url' => 'required|url',
        ]);
        
        foreach ($data as $key => $value) {
            \App\Models\Setting::setValue($key, $value);
        }
        
        return redirect()->back()->with('success', 'Configuración de versión actualizada con éxito.');
    }
}
