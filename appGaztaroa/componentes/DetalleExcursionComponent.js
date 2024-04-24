import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Card } from '@rneui/themed';
import { EXCURSIONES } from '../comun/excursiones';

function RenderExcursion(props) {

    const excursion = props.excursion;
    
        if (excursion != null) {
            return(
            <Card>
              <Card.Image source={require('./imagenes/40Años.png')}>
                <Text style={{color: 'chocolate', fontSize: 30, textAlign: 'center', marginTop: 20}}>{excursion.nombre}</Text>
              </Card.Image>
              <Text style={{margin: 20}}>
                {excursion.descripcion}
              </Text>
            </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

class DetalleExcursion extends Component {
        constructor(props) {
            super(props);
            this.state = {
                excursiones: EXCURSIONES
            };
        }
      
        render(){
            const {excursionId} = this.props.route.params;
            return(<RenderExcursion excursion={this.state.excursiones[+excursionId]} />);
        }
}

export default DetalleExcursion;
