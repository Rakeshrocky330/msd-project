const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <h1>My Website</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>Copyright © 2023</p>
      </footer>
    </div>
  )
}

export default Layout


import './globals.css'

export const metadata = {
      generator: 'v0.app'
    };
