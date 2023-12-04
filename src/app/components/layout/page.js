import { getServerSession } from 'next-auth';
import { redirect } from "next/navigation";
import Nav from '../nav/page';
import "@fortawesome/fontawesome-svg-core/styles.css"
import { authOptions } from '../../api/auth/[...nextauth]/route';
import Toast from '../ToasterComponent';

export default async function Layout({children}) {
  const session = await getServerSession(authOptions);
  if (!session) return (redirect("/"));

  return (
    <div className="flex">
      <div className="p-2 w-1/6 overflow-y-auto text-center bg-gray-900 min-h-screen">
        <Nav user={session ? session.user : []} />
      </div>
      <div className="p-2 overflow-y-auto w-5/6 min-h-screen">
          <Toast />
          {children}
      </div>
    </div>
  )
}