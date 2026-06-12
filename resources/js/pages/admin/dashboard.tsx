import { Head, Link } from '@inertiajs/react';
import { Users, TrendingUp, Search, DollarSign, ArrowRight, ShieldAlert, UserPlus, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminDashboard({ stats, recentUsers, recentActivities }: any) {
    // If stats are not passed from backend yet, we use fallbacks
    const safeStats = stats || {
        totalUsers: 24532,
        newUsersWeek: 142,
        totalRevenue: 45231,
        totalLookups: 142000,
        estSavings: 1200000
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 overflow-y-auto rounded-xl p-6 md:p-8 max-w-7xl mx-auto w-full">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-foreground">
                            Panel de Super Administrador
                        </h1>
                        <p className="text-lg text-muted-foreground mt-2">
                            Bienvenido al panel de control principal. Aquí tienes un resumen de la plataforma.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/admin/reports">
                            <Button variant="outline" className="gap-2 bg-card text-card-foreground hover:bg-muted">
                                Descargar Reporte
                            </Button>
                        </Link>
                        <Link href="/admin/users">
                            <Button className="gap-2">
                                Gestionar Usuarios
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full transition-transform group-hover:scale-110"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold">{safeStats.totalUsers.toLocaleString()}</h3>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Usuarios Totales</p>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full transition-transform group-hover:scale-110"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold">${(safeStats.estSavings).toLocaleString()}</h3>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Ahorro Generado</p>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 dark:bg-amber-900/20 rounded-full transition-transform group-hover:scale-110"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
                                <Search className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold">{safeStats.totalLookups.toLocaleString()}</h3>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Búsquedas de Farmacias</p>
                        </div>
                    </div>

                    <div className="bg-card text-card-foreground rounded-2xl p-6 border border-border shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 dark:bg-purple-900/20 rounded-full transition-transform group-hover:scale-110"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center">
                                <DollarSign className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-bold">${(safeStats.totalRevenue).toLocaleString()}</h3>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Ingresos de Plataforma</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                    {/* Recent Users List */}
                    <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm flex flex-col">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50 rounded-t-2xl">
                            <h3 className="text-lg font-bold">Usuarios Recientes</h3>
                            <Link href="/admin/users" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                Ver todos <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="p-6 flex-1">
                            <div className="space-y-6">
                                {recentUsers?.map((user: any) => (
                                    <div key={user.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={
                                            user.onboarding_completed 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                            : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
                                        }>
                                            {user.onboarding_completed ? 'Activo' : 'Pendiente'}
                                        </Badge>
                                    </div>
                                ))}
                                {(!recentUsers || recentUsers.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No hay usuarios recientes.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Activity Feed */}
                    <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm flex flex-col">
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/50 rounded-t-2xl">
                            <h3 className="text-lg font-bold">Actividad Reciente</h3>
                            <Link href="/admin/activity" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                Ver registro <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="p-6 flex-1">
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                                
                                {recentActivities?.map((activity: any) => {
                                    const isSignup = activity.type === 'user_signup';
                                    const isAlarm = activity.type === 'price_alarm';
                                    
                                    return (
                                        <div key={activity.id} className="relative flex items-start gap-4">
                                            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-card shrink-0 relative z-10 
                                                ${isSignup ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : ''}
                                                ${isAlarm ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : ''}
                                                ${!isSignup && !isAlarm ? 'bg-primary/10 text-primary' : ''}
                                            `}>
                                                {isSignup && <UserPlus className="w-4 h-4" />}
                                                {isAlarm && <ShieldAlert className="w-4 h-4" />}
                                                {!isSignup && !isAlarm && <Activity className="w-4 h-4" />}
                                            </div>
                                            <div className="pt-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium">{activity.title}</p>
                                                    <time className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md ml-2 whitespace-nowrap">
                                                        {new Date(activity.created_at).toLocaleDateString()}
                                                    </time>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-0.5">{activity.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {(!recentActivities || recentActivities.length === 0) && (
                                    <p className="text-sm text-muted-foreground text-center py-4">No hay actividad reciente.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard Overview',
            href: '/admin/dashboard',
        },
    ],
};
