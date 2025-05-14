import { MantineProvider } from "@mantine/core"
import '@mantine/core/styles.css';
import './index.css'
import THEME from "./theme"
import AppRouterProvider from "./routing/AppRouterProvider";

const App = () => {
  return (
   <MantineProvider theme={THEME}>
    <AppRouterProvider />
   </MantineProvider>
  )
}

export default App
