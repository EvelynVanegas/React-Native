// REACT
import React from 'react';
import { Text, ScrollView } from 'react-native';
import { Card } from '@rneui/themed';

// REDUX
import { connect } from 'react-redux';

// FIREBASE
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Componentes
import IndicadorActividad from '../componentes/IndicadorActividadComponent';

function RenderItem(props) {
    const { item } = props;
    const [imageUrl, setImageUrl] = React.useState(null);

    React.useEffect(() => {
        const fetchImageUrl = async () => {
            try {
                const storage = getStorage();
                const imageRef = ref(storage, `public/${item.imagen}`);
                const url = await getDownloadURL(imageRef);
                setImageUrl(url);
            } catch (error) {
                console.error('Error fetching image URL:', error);
            }
        };

        if (item && item.imagen) {
            fetchImageUrl();
        }
    }, [item]);

    if (!item) {
        return null;
    }

    return (
        <Card>
            {imageUrl ? (
                <Card.Image source={{ uri: imageUrl }}>
                    <Text style={{ color: 'chocolate', fontSize: 30, textAlign: 'center', marginTop: 20 }}>{item.nombre}</Text>
                </Card.Image>
            ) : (
                <IndicadorActividad />
            )}
            <Card.Divider />
            <Text style={{ margin: 20 }}>{item.descripcion}</Text>
        </Card>
    );
}

const Home = ({ cabeceras, excursiones, actividades, isLoading }) => (
    <ScrollView>
        {isLoading && <IndicadorActividad />}
        <RenderItem item={cabeceras.find((cabecera) => cabecera.destacado)} />
        <RenderItem item={excursiones.find((excursion) => excursion.destacado)} />
        <RenderItem item={actividades.find((actividad) => actividad.destacado)} />
    </ScrollView>
);

const mapStateToProps = state => ({
    excursiones: state.excursiones.excursiones,
    cabeceras: state.cabeceras.cabeceras,
    actividades: state.actividades.actividades,
    isLoading: state.excursiones.isLoading,
});

export default connect(mapStateToProps)(Home);