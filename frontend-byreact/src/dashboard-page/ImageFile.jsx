import React, { useEffect, useState } from 'react';
import { request, Config } from '../util/apiUtil';
import { Card, List, Image, Divider } from 'antd';

const ImageFile = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        getImage();
    }, []);

    const getImage = async () => {
        try {
            const res = await request('GET', 'upload/findAll');
            if (res.status === 200 && Array.isArray(res.data)) {
                setImages(res.data);
            }
        } catch (err) {
            console.error('Error fetching images:', err);
        }
    };

    return (
        <div>
            <Divider
                orientation="Center"
                style={{ 
                    fontSize: '30px', 
                    color: 'green', 
                    margin: '30px 0px',
                    fontWeight: 'bold',
                    borderColor: 'red',
                }}
            >
                Image Gallery
            </Divider>
            <List
                grid={{
                    gutter: 16,
                    column: 4,
                }}
                dataSource={images}
                loading={images.length === 0}
                renderItem={(item) => (
                    <List.Item>
                        <Card
                            cover={
                                <Image
                                    alt={item.name}
                                    src={`${Config.image_path}${item.name}`}
                                    style={{ height: 150, objectFit: 'full' }}
                                    onError={(e) => (e.target.src = '/placeholder.jpg')} // Fallback image
                                />
                            }
                        >
                            <Card.Meta
                                title={item.name}
                                description={
                                    <a href={item.downloadUri} download>
                                        Download
                                    </a>
                                }
                            />
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default ImageFile;


// import React, { useEffect, useState } from 'react'
// import { request, Config } from '../util/apiUtil';
// import { Card, List } from 'antd';

// const Image = () => {
//     const [images, setImages] = useState([]);

//     useEffect(() => {
//         getImage();
//     }, []);

//     const getImage = async () => {
//         const res = await request('GET', 'upload/findAll');
//         console.log(res);
//         if (res.status === 200 && Array.isArray(res.data)) {
//             setImages(res.data);
//         }
//     };

//     const data = [
//         {
//           title: 'Title 1',
//         },
//         {
//           title: 'Title 2',
//         },
//         {
//           title: 'Title 3',
//         },
//         {
//           title: 'Title 4',
//         },
//       ];

//     return (
//         <div>
//             <h1>Image Gallery</h1>
//             {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
//             {images.map((item) => (
//                 <div
//                     key={item.name}
//                     style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}
//                 >
//                     <img
//                         alt={item.name}
//                         src={`${Config.image_path}${item.name}`}
//                         style={{ height: 100, width: 100, objectFit: 'cover', marginTop: '10px' }}
//                     />
//                     <p></p>
//                     <a href={item.downloadUri} download>
//                         Download
//                     </a>
//                 </div>
//             ))}
//         </div> */}
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
//                 {images.map((item) => (
//                     <List
//                     grid={{
//                       gutter: 16,
//                       column: 4,
//                     }}
//                     dataSource={data}
//                     renderItem={(item) => (
//                       <List.Item>
//                         <Card title={item.title}>Card content</Card>
//                       </List.Item>
//                     )}
//                   />
//                 ))}
//             </div>
//         </div>
//     )
// }

// export default Image
