"use client";

import { User, Mail, Github, LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AccountClient() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col p-8 md:p-12 xl:p-16">
      <div className="fixed inset-0 z-0 bg-black pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-lynx-accent/10 blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col flex-1">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">
          Account Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-lynx-primary/50 overflow-hidden mb-4">
                {user?.image ? (
                  
                  <Image src={user.image} alt={user.name} width={100} height={100} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lynx-primary text-3xl font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">{user?.name || "User"}</h2>
              <p className="text-zinc-400 text-sm mb-6">{user?.email}</p>

              <button 
                onClick={handleSignOut}
                className="w-full py-2.5 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">Personal Information</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Full Name</label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                    <User className="w-5 h-5 text-zinc-400" />
                    <span className="text-white">{user?.name}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">Email Address</label>
                  <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3">
                    <Mail className="w-5 h-5 text-zinc-400" />
                    <span className="text-white">{user?.email}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">Connected Accounts</h3>
              
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white">
                    <Github className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">GitHub</h4>
                    <p className="text-xs text-zinc-400">Connected</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-lynx-accent hover:text-white transition-colors">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
