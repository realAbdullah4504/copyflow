import { useSubmissions } from '@/hooks/useSubmissions'

const LoginForm = () => {
  const {submissions}=useSubmissions()
  return (
    <div className="flex flex-col gap-4">
      {submissions.map((submission) => (
        <div key={submission.id} className="p-4 border border-gray-200 rounded-lg">{JSON.stringify(submission)}</div>
      ))}
    </div>
  )
}

export default LoginForm
