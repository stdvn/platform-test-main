import './App.css'
import axios from 'axios';
import React, { Component } from 'react';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            selectedFile: null,
            products: null,
        };
    }


    updateSelectedFile = (event) => {
        this.setState({
            ...this.state,
            selectedFile: event.target.files[0],
        });
    };

    uploadFile = async () => {
        const formData = new FormData();

        formData.append(
            'file',
            this.state.selectedFile
        );
        formData.append('content-type', 'text/csv');

        const config = {
            headers: { 'content-type': 'multipart/form-data' },
        };

        const products = await axios.post('http://localhost:5000/upload', formData, config);

        this.setState({
            ...this.state,
            products: products.data,
            step: 2,
        });
    }

    back = () => {
        this.setState({
            ...this.state,
            step: 1,
        });
    }

    ProductList = () => {
        const products = this.state.products.data.map((product) =>
            <li>
                <div className="product-details">
                    <div className="mr-7 status ok">
                        OK
                    </div>
                    <div>
                        <span className="mr-1">{product.id}</span>
                        -
                        <span className="ml-1 mr-1">{product.name}</span>
                        -
                        <span className="ml-1">{product.picture?.width}x{product.picture?.height}</span>
                    </div>
                </div>
                <img src={product.picture.url} />
            </li>
        );
        const errors = this.state.products.errors.map((error) =>
            <li className="ko">
                <div className="product-details">
                    <div className="mr-7 status ko">
                        KO
                    </div>
                    <div>
                        <span className="mr-1">{error.id}</span>
                        -
                        <span className="ml-1">{error.message}</span>
                    </div>
                </div>
            </li>
        );

        return (
            <ul>
                {products}
                {errors}
            </ul>
        );
    }

    render() {
        return (
            <div className="App">
                <div class="header">
                    {
                        this.state.step === 1
                        &&
                        <button onClick={this.uploadFile}>Validate</button>
                    }
                    {
                        this.state.step === 2
                        &&
                        <button onClick={this.back}>&larr;</button>
                    }
                </div>
                <div className="breadcrumb">
                    <div className={`step ${this.state.step === 1 ? 'selected' : ''}`}>
                        <div className="step-number mr-1">1</div>
                        <span className="step-title">products</span>
                    </div>
                    <div className={`step ${this.state.step === 2 ? 'selected' : ''}`}>
                        <div className="step-number mr-1">2</div>
                        <span className="step-title">results</span>
                    </div>
                </div>
                {
                    this.state.step === 1
                    &&
                    <div className="upload-file">
                        <input className="select-file" type="file" onChange={this.updateSelectedFile} />
                    </div>
                }
                {
                    this.state.step === 2
                    &&
                    <this.ProductList />
                }


                
            </div>
        )
    }

 
}

export default App
