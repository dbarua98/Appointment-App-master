import { HomePage, TasksPage, ProfilePage,ItemPage,DoctorPage,SpecialtyPage,AppointmentPage,ReceiptPage} from './pages';
import { withNavigationWatcher } from './contexts/navigation';

const routes = [
    // {
    //     path: '/tasks',
    //     element: TasksPage
    // },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    },
    {
        path: '/item',
        element: ItemPage
    },
    {
        path: '/doctor',
        element: DoctorPage
    },
    {
        path: '/specialty',
        element: SpecialtyPage
    },
    {
        path: '/appointment',
        element: AppointmentPage
    },
    {
        path: '/receipt',
        element: ReceiptPage
    }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
