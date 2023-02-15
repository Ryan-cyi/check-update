import { getMaxZIndex, Styled } from "./styled";

const dialogContainer = Styled.div`
background-color: white; 
width: 480px; 
height: 180px;
position: absolute;
left: calc(50% - 240px);
top: calc(50vh - 90px);
border-radius: 4px;
padding: 20px;
box-sizing: border-box;
display: flex;
flex-direction: column;
`;

const dialogContent = Styled.div`
box-sizing: border-box;
background-color: #fff;
color: #555;
font-size: 16px;
`;

const dialogFooter = Styled.div`
display: flex;
justify-content: flex-end;
align-items: flex-end;
flex:1;
`;
const Button = Styled.button`
display: inline-block;
line-height: 1;
white-space: nowrap;
cursor: pointer;
background: #fff;
border: 1px solid #dcdfe6;
color: #606266;
-webkit-appearance: none;
text-align: center;
box-sizing: border-box;
outline: none;
margin: 0;
transition: .1s;
font-weight: 500;
-moz-user-select: none;
-webkit-user-select: none;
-ms-user-select: none;
padding: 8px 18px;
font-size: 14px;
border-radius: 4px;
margin-left: 14px;
`;

const Title = Styled.div`
font-size: 18px;
font-weight: blod;
color: #333;
`;

type IDialogPayload = {
    message: string;
    confirmBtnText: string;
    delayBtnText: string;
};

export function showDialog(payload: IDialogPayload) {
    return new Promise((resolve) => {
        const index = getMaxZIndex()

        const container = Styled.div`background-color: rgba(0,0,0,0.25); position: absolute;top: 0;left: 0;right: 0;bottom: 0;z-index: ${index};`

        const title = Title("Tips");

        const content = dialogContent(title);

        const message = Styled.div`padding:20px 0px;`(payload.message);

        content.append(message);

        const confirmBtn = Button(payload.confirmBtnText, {
            style: "background-color: var(--primary-color, #409eff); color: #fff;border-style:unset;padding: 9px 18px;",
            click: () => {
                document.body.removeChild(box);
                return resolve(true);
            },
        });

        const delayBtn = Button(payload.delayBtnText, {
            click: () => {
                document.body.removeChild(box);
                return resolve(false);
            },
        });

        const footer = dialogFooter([delayBtn, confirmBtn]);

        let dialog = dialogContainer([content, footer]);

        const box = container(dialog);

        document.body.append(box);
    });
}
