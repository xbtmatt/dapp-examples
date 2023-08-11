import { useEffect, useState } from "react";

interface OnRenderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const OnRenderComponent = (props: OnRenderProps) => {
    const [postRender, setPostRender] = useState<boolean>(false);
    useEffect(() => {
        setPostRender(true);
    }, []);
    return <>{postRender ? <> {props.children} </> : <> </>}</>;
};

export default OnRenderComponent;
