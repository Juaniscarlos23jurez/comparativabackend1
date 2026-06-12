import { Head, router } from '@inertiajs/react';
import { Search, MoreVertical, Shield, User, Filter, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminUsers({ users, filters }: any) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm !== (filters?.search || '')) {
                router.get('/admin/users', { search: searchTerm }, { preserveState: true, replace: true });
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, filters?.search]);

    return (
        <>
            <Head title="User Management" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">User Management</h1>
                        <p className="text-muted-foreground mt-1">Manage and view all registered users across the platform.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="gap-2 bg-card text-card-foreground hover:bg-muted">
                            <Download className="w-4 h-4" /> Export CSV
                        </Button>
                        <Button className="gap-2">
                            <User className="w-4 h-4" /> Add User
                        </Button>
                    </div>
                </div>

                <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 items-center justify-between bg-muted/50">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search by name or email..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-card"
                            />
                        </div>
                        <Button variant="outline" className="gap-2 shrink-0 bg-card hover:bg-muted">
                            <Filter className="w-4 h-4" /> Filters
                        </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 font-medium">User</th>
                                    <th className="px-6 py-4 font-medium">Role</th>
                                    <th className="px-6 py-4 font-medium">Plan</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.data.map((user: any) => {
                                    const status = user.onboarding_completed ? 'active' : 'pending';
                                    const plan = user.profile_data?.plan || 'Basic Free';
                                    
                                    return (
                                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-foreground">{user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    {user.role === 'super_admin' ? <Shield className="w-3.5 h-3.5 text-amber-500" /> : <User className="w-3.5 h-3.5" />}
                                                    <span className="capitalize">{user.role?.replace('_', ' ') || 'User'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-foreground">{plan}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={
                                                    status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 
                                                    'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                                                }>
                                                    {status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="p-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground bg-muted/50">
                        <div>Showing {users.from || 0} to {users.to || 0} of {users.total} results</div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={!users.prev_page_url}
                                onClick={() => router.get(users.prev_page_url, { search: searchTerm }, { preserveState: true })}
                            >
                                Previous
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={!users.next_page_url}
                                onClick={() => router.get(users.next_page_url, { search: searchTerm }, { preserveState: true })}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminUsers.layout = {
    breadcrumbs: [
        {
            title: 'User Management',
            href: '/admin/users',
        },
    ],
};
