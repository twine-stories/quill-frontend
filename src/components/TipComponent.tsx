import React, { useState, useContext } from 'react'
import { Grid, CircularProgress } from '@mui/joy'
import TwineInput from '../components/TwineInput.tsx'
import TwineButton from '../components/TwineButton.tsx'
import { genericPost } from '../utils/api.ts'
import { User, Like, ProfitSplit, Tip, Work } from '../utils/types.ts'
import { tip } from '../utils/blockchain/tipping.ts'
import { UserContext } from '../App.tsx'
import { ConnectType } from '../utils/enums.ts'
import {
    microToAlgo,
    algoToMicro,
    TWINE_CUT,
} from '../utils/blockchain/constants.ts'


function TipComponent({ showTip, setOpenTipError, setOpenTipSuccess, setOpenError, episode, work, percentages }) {
    const [showAnimation, setShowAnimation] = useState<boolean>(false)
    const [processingTip, setProcessingTip] = useState<boolean>(false)
    const context: object = useContext(UserContext)
    const user: User = context['user']
    const prepareSuccessAnimation = () => {
        setTimeout(() => {
            setOpenTipSuccess(true)
            setShowAnimation(false)
        }, 4700)
    }

    return (
        <>
            <Grid
                container
                alignItems="center"
                className="tip-pop-up"
                direction="column"
                sx={
                    showTip
                        ? {
                            marginTop: '20px',
                            background: '#202020',
                            padding: '10px 0',
                            borderRadius: '15px',
                        } : {
                            visibility: 'hidden',
                        }
                }
            >
                <img
                    src={
                        showAnimation
                            ? '/icons/tipping-animation.gif'
                            : '/icons/tipping-animation-first.png'
                    }
                    style={{ width: '100%' }}
                />
                <Grid
                    container
                    alignItems="center"
                    direction="column"
                    sx={
                        showTip
                            ? {
                                marginTop: '20px',
                                background:
                                    '#202020',
                                padding:
                                    '0px 20px',
                                borderRadius:
                                    '15px',
                            } : {
                                visibility:
                                    'hidden',
                                padding: '20px',
                            }
                    }>
                    <TwineInput
                        type="number"
                        label={
                            'Send tip to @' +
                            episode?.work?.creator?.userName || ''
                        }
                        placeholder="tip amount"
                        inputAttrs={{
                            id: 'tipInput',
                        }}
                        endDecorator="/icons/algo.svg"
                    />
                    <TwineButton
                        icon="/icons/green_checkmark.svg"
                        sx={{ marginTop: '20px' }}
                        color="green"
                        name={
                            processingTip ? (
                                <CircularProgress
                                    color="darkgreen"
                                    variant="plain"
                                />
                            ) : (
                                'Confirm'
                            )
                        }
                        action={() => {
                            if (user) {
                                const tipVal =
                                    document.getElementById(
                                        'tipInput'
                                    ) as HTMLInputElement
                                if (
                                    tipVal &&
                                    tipVal.value &&
                                    parseFloat(
                                        tipVal.value
                                    ) >= 0.1
                                ) {
                                    const adjustedVal: bigint =
                                        algoToMicro(
                                            parseFloat(
                                                tipVal.value
                                            )
                                        )
                                    tip(
                                        user.walletAddress,
                                        creators,
                                        percentages,
                                        adjustedVal,
                                        user.connectType ===
                                        ConnectType.PERA,
                                        setProcessingTip
                                    ).then(() => {
                                        setShowAnimation(
                                            true
                                        )
                                        prepareSuccessAnimation()
                                        tipVal.value =
                                            ''
                                        const tipObj: Tip =
                                        {
                                            tipper: user,
                                            episode:
                                                episode,
                                            amount:
                                                microToAlgo(
                                                    adjustedVal
                                                ) *
                                                (1.0 -
                                                    TWINE_CUT),
                                        }
                                        genericPost(
                                            '/api/tip/tip',
                                            tipObj
                                        )
                                    })
                                } else {
                                    setOpenTipError(
                                        true
                                    )
                                }
                            } else {
                                setOpenError(true)
                            }
                            setProcessingTip(false)
                        }}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default TipComponent