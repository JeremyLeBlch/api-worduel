import ProfileForm from '@/components/layout/ProfileForm'
import ProfileStats from '@/components/layout/ProfileStats'
import { useQuery } from '@apollo/client'
import { GET_USER_PROFILE } from '@/api/login'

const ProfilePage = () => {
  const { data, loading, error } = useQuery(GET_USER_PROFILE);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const username = data?.me?.username || 'Mon Compte';

  return (
    <div className="min-h-screen w-[90vw] flex flex-col items-center px-4 pt-14 mx-auto">
      <h2 className='text-3xl uppercase mb-6'>{username}</h2>
      <div className="w-full max-w-7xl h-full flex flex-col md:flex-row justify-center items-start mt-4 gap-12">
        <section className='w-full lg:w-1/2 flex flex-col'>
          <h3 className='text-2xl text-center'>Modifier mon profil</h3>
          <ProfileForm />
        </section>
        <section className='w-full lg:w-2/3 flex flex-col'>
          <h3 className='text-2xl text-center'>Mes Statistiques</h3>
          <ProfileStats />
        </section>
      </div>
    </div>
  )
}

export default ProfilePage
