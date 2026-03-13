export function AmbientGlow() {
  return (
    <div className='pointer-events-none fixed inset-0 z-0'>
      <div className='absolute -left-32 -top-32 h-64 w-64 rounded-full bg-(--neon)/5 blur-3xl' />
      <div className='absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-(--hot)/4 blur-3xl' />
    </div>
  );
}
