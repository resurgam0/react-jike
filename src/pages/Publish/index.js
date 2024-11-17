import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
    Upload,
    Space,
    Select,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useRef, useState, useEffect } from 'react'
import { createArticleAPI, getArticleById, updateArticleAPI } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'
const { Option } = Select

const Publish = ()=>{
    const {channels} = useChannel()
    // 上传图片
    const [imageList, setImageList] = useState([])
    
    // 上传图片
    const cacheImageList = useRef([])

    const onUploadChange = (info)=>{
        setImageList(info.fileList)
        cacheImageList.current = info.fileList
    }
    // 控制图片Type
    const [imageType, setImageType] = useState(0)
    const onTypeChange = (e)=>{
        const type = e.target.value
        setImageType(type)
        if(type===1){
            // 单图，截取第一张展示
            const imgList = cacheImageList.current[0] ? [cacheImageList.current[0]] : []
            setImageList(imgList)
        }else if(type===3){
            // 三图，取所有图片展示
            setImageList(cacheImageList.current)
        }
    }

    // 提交表单
    const onFinish = async (formValue)=>{
        // 校验封面类型imageType是否和实际的图片列表imageList数量是相等的
        if(imageList.length!==imageType) return message.warning('封面类型和图片数量不匹配')
        const {title, content, channel_id} = formValue
        // 1.按照接口文档的格式处理收集到的表单数据
        const reqData = {
            title,
            content,
            type: imageType,
            cover: {
                type: imageType, //封面模式
                images: imageList.map(item=>{
                    if(item.response){
                        return item.response.data.url
                    }else{
                        return item.url
                    }
                }) //图片列表
            },
            channel_id
        }
        // 2.调用接口提交
        if(articleId){
            await updateArticleAPI({...reqData, id: articleId})
            message.success('编辑文章成功')
        }else{
            await createArticleAPI(reqData)
            message.success('发布文章成功')
        }
    }
    const [searchParams] = useSearchParams()
    const articleId = searchParams.get('id')
    // 获取实例
    const [form] = Form.useForm()
    // 回填数据
    useEffect(()=>{
        // 1.通过id获取数据
        // 2.调用实例方法 完成回调
        async function getArticleDetail(){
            const res = await getArticleById(articleId)
            const {data} = res
            const {cover} = data
            const {type, images} = cover
            form.setFieldsValue({
                ...data,
                type
            })
            // 回填图片列表
            setImageType(type)
            // 显示图片
            setImageList(images.map(url=>{
                return {url}
            }))
        }
        articleId && getArticleDetail()
    }, [articleId, form])
    return (
        <div className='publish'>
            <Card title={
                <Breadcrumb items={[
                    {title: <Link to={'/'}>首页</Link>},
                    {title: `${articleId ? '编辑' : '发布'}文章`}
                ]}/>
            }>
                <Form labelCol={{span: 4}} wrapperCol={{span: 16}} initialValues={{type: 0}} onFinish={onFinish} form={form}>
                    <Form.Item label="标题" name="title" rules={[{required: true, message: '请输入文章标题'}]}>
                        <Input placeholder='请输入文章标题' style={{width: 400}}></Input>
                    </Form.Item>
                    <Form.Item label="频道" name="channel_id" rules={[{required: true, message: '请选择文章频道'}]}>
                        <Select placeholder="请选择文章频道" style={{width: 400}}>
                             {channels.map(item => (
                                <Option key={item.id} value={item.id}>
                                {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="封面">
                        <Form.Item name="type">
                            <Radio.Group onChange={onTypeChange}>
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {imageType > 0 && <Upload
                            name="image"
                            listType="picture-card"
                            className='avatar-uploader'
                            showUploadList
                            action={'http://geek.itheima.net/v1_0/upload'}
                            onChange={onUploadChange}
                            maxCount={imageType}
                            multiple={imageType > 1}
                            fileList={imageList}
                        >
                            <div style={{ marginTop: 8 }}>
                                <PlusOutlined />
                            </div>
                        </Upload>}
                    </Form.Item>
                    <Form.Item label="内容" name="content" rules={[{required: true, message: '请输入文章内容'}]}>
                        <ReactQuill
                            className="publish-quill"
                            theme="snow"
                            placeholder="请输入文章内容"
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{offset: 4}}>
                        <Space>
                            <Button size="large" type='primary' htmlType='submit'>发布文章</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
export default Publish