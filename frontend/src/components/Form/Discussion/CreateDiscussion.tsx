// @ts-ignore
import React, {FC, useEffect, useState, useRef, startTransition} from 'react';
import {FormProvider, useForm} from "react-hook-form";
import {FormDiscussion} from "../../../types/form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {discussionSchema} from "../schema";
import styles from "./create-discussion.module.css"
import FormInput from "../Input/FormInput";
import FormFile from "../FileInput/FormFile";
import FormCheckbox from "../Checkbox/FormCheckbox";
import Checkbox from "../Checkbox/Checkbox";
import {createDiscussion} from "../../../requests/discussions";
import {useRecoilRefresher_UNSTABLE} from "recoil";
import {discussionsByUserSelector} from "../../../store/selectors/discussionsByUser";
import {all_discussionsSelector} from "../../../store/selectors/all_discussions";


interface FormCreateDiscussionProps {
    clear: boolean
}
const CreateDiscussion: FC<FormCreateDiscussionProps> = ({clear}) => {

    const methods = useForm<FormDiscussion>({mode:"onTouched",resolver: yupResolver(discussionSchema)});

    const [response, setResponse] = useState<any>(null)

    const refreshDiscussionsByUser = useRecoilRefresher_UNSTABLE(discussionsByUserSelector);
    const refreshAllDiscussion = useRecoilRefresher_UNSTABLE(all_discussionsSelector);

    const onSubmit = async (formData: FormDiscussion) => {
        const response = await createDiscussion(formData)
        setResponse(response)
        startTransition(() => {
            refreshDiscussionsByUser()
            refreshAllDiscussion()
        })
        methods.reset()
    };

    const [checkPass, setCheckPass] = useState<boolean>(false)
    const [checkAnonym, setCheckAnonym] = useState<boolean>(false)
    const cleaningForm = () => clear ? methods.reset() : ''

    useEffect(() => {
        cleaningForm()
    }, [clear])

    return (
        <FormProvider {...methods}>
            <div className={styles.container}>
                <header className={styles.header}>{response ? response?.message : 'Создание беседы'}</header>
                <form  onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className={styles.field_container}>
                        <div className="flex flex-col items-center w-[250px]">
                            <FormInput title="Название беседы" registerName="title"/>
                            <FormInput title="Описание" registerName="description"/>
                            {checkPass ? <FormInput title="Пароль" type='password' registerName="password"/> : ''}
                            <FormFile title="Загрузить постер" registerName="poster"/>
                        </div>
                        <div className="w-[200px] flex flex-col items-center">
                            <Checkbox title="Пароль" checked={checkPass} setChecked={setCheckPass}/>
                            <FormCheckbox title="Анонимность" checked={checkAnonym} setChecked={setCheckAnonym} registerName="anonymous"/>
                        </div>

                    </div>
                    <footer className={styles.footer}>
                        <button type="submit" className={styles.btn}>Отправить</button>
                    </footer>
                </form>
            </div>
        </FormProvider>
    );
}

export default CreateDiscussion;
