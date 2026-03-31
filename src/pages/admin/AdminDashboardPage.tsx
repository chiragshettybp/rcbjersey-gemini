import { useNavigate } from 'react-router-dom';
import { useOrders } from '@/hooks/useOrders';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Package, IndianRupee, Clock, LogOut, ChevronRight, LucideIcon } from 'lucide-react';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useOrders();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  const totalOrders = orders?.length ?? 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending' || o.status === 'confirmed').length ?? 0;
  const totalRevenue = orders?.reduce((s, o) => s + o.total_amount, 0) ?? 0;
  const recent = orders?.slice(0, 5) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="mx-auto max-w-lg px-4 py-2.5 flex items-center justify-between">
          <h1 className="text-sm font-bold text-foreground tracking-wide uppercase">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')} className="text-xs">
              Orders
            </Button>
            <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <LogOut className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-3 py-3 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard icon={Package} label="Total Orders" value={totalOrders.toString()} />
          <StatCard icon={Clock} label="Pending" value={pendingOrders.toString()} highlight />
          <StatCard icon={IndianRupee} label="Revenue" value={`₹${totalRevenue.toLocaleString('en-IN')}`} />
        </div>

        {/* Recent Orders */}
        <section className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Orders</h2>
            <button onClick={() => navigate('/admin/orders')} className="text-[10px] text-primary font-semibold">
              View All
            </button>
          </div>

          {recent.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center">No orders yet</p>
          ) : (
            recent.map(order => {
              const addr = order.addresses?.[0];
              return (
                <button
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-left active:scale-[0.98]"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {addr?.full_name ?? 'Guest'}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-foreground">₹{order.total_amount.toLocaleString('en-IN')}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                </button>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, highlight }: {
  icon: LucideIcon; label: string; value: string; highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 space-y-1.5">
      <Icon className={`h-4 w-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
      <p className="text-lg font-bold text-foreground leading-none">{value}</p>
      <p className="text-[10px] text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600',
    confirmed: 'bg-blue-500/10 text-blue-600',
    shipped: 'bg-purple-500/10 text-purple-600',
    delivered: 'bg-green-500/10 text-green-600',
  };
  return (
    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${colors[status] ?? 'bg-muted text-muted-foreground'}`}>
      {status}
    </span>
  );
}

export default AdminDashboardPage;
