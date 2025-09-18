import SetEditor from './SetEditor';
import { useParams } from 'react-router-dom';

export default function EditSet() {
    const { categoryId } = useParams();
    return <SetEditor mode={'edit'} categoryId={categoryId} />
}


