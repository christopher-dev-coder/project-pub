export const metadata = {
    title: "TaskManagment Demo",
    description: "A part of the project for an office.doing your tasks easy!",
    keywords: "TODO;DoingYourWorks;ListOfThings;FutureWorks;"
  };
export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
          <nav style={{ padding: "10px", background: "#333", color: "white" }}>
            <h2>Doing Tasks Easly!</h2>
          </nav>
          <main style={{ padding: "20px" }}>{children}</main>
        </body>
      </html>
    );
  }
  