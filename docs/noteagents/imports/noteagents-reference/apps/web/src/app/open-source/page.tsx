import PublicPage from '~/src/components/layout/PublicPage'
import { publicPages } from '~/src/content/public-pages'
export default function OpenSourcePage() { return <PublicPage {...publicPages['open-source']} /> }
