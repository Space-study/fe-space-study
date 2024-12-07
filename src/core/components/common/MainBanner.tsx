const MainBanner = () => {
  return (
    <section
      id='top'
      className='relative h-screen bg-cover bg-center'
      style={{
        backgroundImage:
          "url('https://media0.giphy.com/media/oTnyrIL4iTsiZ8FiPO/200w.gif?cid=6c09b952iijc85q9e82wiijhdlpijz63mwillo2y3ryz8ma9&ep=v1_gifs_search&rid=200w.gif&ct=g')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: '85vh',
      }}>
      <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center'>
        <div className='container mx-auto px-4'>
          <div className='text-center text-white'>
            <h6 className='text-xl'>Hello Students</h6>
            <h2 className='text-4xl font-bold'>Welcome to Education</h2>
            <p className='mt-4 text-lg'>
              This is an edu smart
              <span className='text-sky-300'> Demo By NP</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MainBanner
