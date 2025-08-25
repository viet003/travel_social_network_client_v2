export const tabAction = (tabActive: string) => async (dispatch: any) => {
    // console.log(tabActive)
    dispatch({
        type: tabActive,
    })
}

