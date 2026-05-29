export default function ResultPage({ params }: { params: { token: string } }) {
  return <main><h1>Result {params.token}</h1></main>;
}
