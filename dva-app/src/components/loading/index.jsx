import React, { PropTypes } from 'react';
function Loading({
    text="努力加载中，请稍后...",
    tag="div",
    height=150,
    width="100%",
    colspan=5,
    imgWidth=24,
    fontSize=12,
    textAlign="center"
}){

    const imgSrc = "http://static.12301.cc/assets/build/images/gloading.gif";
    const Img = () => <img src={imgSrc} style={{width:imgWidth,verticalAlign:"middle",marginRight:5}} alt=""/>;
    const Text = () => <span style={{fontSize:fontSize}}>{text}</span>;
    const Table = () => (
        <table style={{width:"100%"}}>
            <tbody>
                <tr>
                    <td style={{height:height,textAlign:textAlign}}>
                        <Img/>
                        <Text></Text>
                    </td>
                </tr>
            </tbody>
        </table>
    );

    return(
        <div>
            {do{
                if(tag=="div"){
                    <div style={{width:width}}><Table/></div>;
                }else if(tag=="td"){
                    <td style={{width:width}} colspan={colspan}><Table/></td>;
                }else if(tag=="tr"){
                    <tr><td style={{width:width}} colspan={colspan}><Table/></td></tr>;
                }
            }}
        </div>
    )
}
Loading.propTypes = {
    text : PropTypes.string,
    imgWidth : PropTypes.number,
    fontSize : PropTypes.number,
    tag : PropTypes.oneOf(["div","tr","td"]),
    height : PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    width : PropTypes.oneOfType([PropTypes.number,PropTypes.string]),
    textAlign : PropTypes.oneOf(["center","left","right"]),
    colspan : PropTypes.number
}

export default Loading;
