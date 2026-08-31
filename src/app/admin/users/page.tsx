import connectDB from '@/lib/db';
import User from '@/lib/models/User';

export default async function AdminUsersPage() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tighter text-[#F2F2EF] mb-8">All Users</h1>

      <div className="bg-[#161617] border border-[#333] overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#333] text-[#9A9A96] text-xs uppercase tracking-wider">
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Email</th>
              <th className="p-4 font-bold">Joined</th>
              <th className="p-4 font-bold text-right">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id.toString()} className="border-b border-[#222] hover:bg-[#222] transition-colors">
                <td className="p-4">
                  <div className="font-bold text-[#F2F2EF] text-sm uppercase">{user.firstName} {user.lastName}</div>
                </td>
                <td className="p-4 text-sm text-[#9A9A96]">
                  {user.email}
                </td>
                <td className="p-4 text-sm text-[#9A9A96]">
                  {new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </td>
                <td className="p-4 text-right">
                  <span className={`text-xs font-bold uppercase px-2 py-1 ${
                    user.role === 'admin' ? 'bg-[#5FA83D] text-black' : 'bg-[#333] text-[#F2F2EF]'
                  }`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-[#9A9A96] uppercase text-sm font-bold">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
