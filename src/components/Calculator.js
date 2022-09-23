import React, { useState, Fragment } from 'react';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { useForm, Controller } from 'react-hook-form'
import { styled } from '@mui/material/styles';
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import CloseIcon from 'mdi-material-ui/Close';

const ContentWrapper = styled('div')(({ theme }) => ({
    width: '35%',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0px 11px 15px -7px rgb(58 53 65 / 20%), 0px 24px 38px 3px rgb(58 53 65 / 14%), 0px 9px 46px 8px rgb(58 53 65 / 12%)',
    padding: '1rem',
    border: '1px solid #979191',
    margin: '0px auto',
    [theme.breakpoints.down('md')]: {
        width: '100%'
    },
    [theme.breakpoints.down('sm')]: {
        width: '100%'
    },
    [theme.breakpoints.down('lg')]: {
        width: '100%'
    }
}))


const Calculator = () => {
    const { control, formState: { errors } } = useForm({ mode: 'onChange' })

    const [values, setValues] = useState([{ count: 0, sign: '+', disable: false }])
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(false)

    let addRow = () => {
        if (values[values.length - 1].count !== 0) {
            setValues([...values, { count: 0, sign: '+', disable: false }])
        }else{
            setError(true)
        }
    }

    let removeRow = (i) => {
        setError(false)
        let copyValues = [...values];
        copyValues.splice(i, 1);
        setValues(copyValues);
        calculateTotal(copyValues)
    }

    let disableRow = (i) => {
        setError(false)
        let copyValues = [...values];
        copyValues[i].disable = true;
        setValues(copyValues);
        setTotal(total - values[i].count)
    }

    let enableRow = (i) => {
        setError(false)
        let copyValues = [...values];
        copyValues[i].disable = false;
        setValues(copyValues);
        setTotal(total + parseInt(values[i].count))
    }

    let handleValuesChange = (data, field, i) => {
        setError(false)
        field.onChange(data.target.value);
        let copyValues = [...values];
        copyValues[i][data.target.name] = data.target.value;
        setValues(copyValues);
        calculateTotal(copyValues)
    }

    const handleChangeSign = (i, data) => {
        setError(false)
        let copyValues = [...values];
        copyValues[i][data.target.name] = data.target.value;
        setValues(copyValues);
        if (data.target.value == '+') {
            setTotal(total + parseInt(values[i].count))
        } else {
            let value = copyValues.map((item) => {
                return parseInt(item.count);
            })
            value.splice(i, 1);
            setTotal(total - values[i].count);
        }
    };

    let calculateTotal = (arr) => {
        let value = arr.map((item, index) => {
            if (item.disable === false) {
                return parseInt(item.count)
            } else {
                return 0
            }
        })
        let addition = value.reduce((a, b) => a + b, 0);
        setTotal(addition);
    }

    return (
        <Box className='layout-page-content'
            sx={{
                mx: 'auto',
                '@media (min-width:1440px)': { maxWidth: 1440 },
                '@media (min-width:1200px)': { maxWidth: '100%' },
                paddingTop: '3rem',
            }}>

            <ContentWrapper>
                <Typography variant='h5' textAlign='center' mb={4}>Calculator</Typography>

                <Grid container spacing={2}>
                    {
                        values.map((element, index) => (
                            <Fragment key={index}>
                                <Grid item xs={12} md={7} >
                                    <FormControl sx={{ mb: 0, width: '100%' }}>
                                        <Controller
                                            name='count'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    size='small'
                                                    name='count'
                                                    type="number"
                                                    value={element.count == 0 ? "" : element.count}
                                                    label='Count'
                                                    disabled={!values[index].disable ? false : true}
                                                    onChange={(data) => handleValuesChange(data, field, index)}
                                                />
                                            )}
                                        />
                                    </FormControl>
                                </Grid>
                                {
                                    values.length > 1 ?
                                        <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                            <select
                                                value={values.sign}
                                                onChange={(data) => handleChangeSign(index, data)}
                                                disabled={!values[index].disable ? false : true}
                                                style={{
                                                    borderRadius: '5px',
                                                    width: '55px',
                                                    fontSize: '20px',
                                                    textAlign:'center'
                                                }}
                                            >
                                                <option value="+">+</option>
                                                <option value="-">-</option>
                                            </select>
                                            <Button disabled={!values[index].disable ? false : true} size='small' color='error' variant='outlined' onClick={() => removeRow(index)}>
                                                <CloseIcon />
                                            </Button>
                                            {!values[index].disable ?
                                                <Button disabled={values[index].disable} size='small' variant='outlined' onClick={() => disableRow(index)}>
                                                    <EyeOutline />
                                                </Button> :
                                                <Button disabled={!values[index].disable} size='small' variant='outlined' onClick={() => enableRow(index)}>
                                                    <EyeOffOutline />
                                                </Button>}
                                        </Grid>
                                        : null
                                }
                            </Fragment>
                        ))
                    }
                    <Grid
                        item
                        container
                        alignItems="center"
                        direction="column"
                        justifyContent="center">
                        <Typography variant='body2' py={2} fontSize={30}>
                            {total == 0 ? 0 : total.toString()}
                        </Typography>
                    </Grid>

                    <Grid
                        item
                        container
                        alignItems="center"
                        direction="column"
                        justifyContent="center">
                        <Button size='small' color='primary' variant='outlined' onClick={() => addRow()}>
                            Add Row
                        </Button>
                    </Grid>

                    <Grid
                        item
                        container
                        alignItems="center"
                        direction="column"
                        justifyContent="center">
                        {
                            error ? <Typography variant='body2' color='red' py={2} fontSize={15}>
                                Input is Empty
                            </Typography> : null
                        }
                    </Grid>
                </Grid>
            </ContentWrapper>
        </Box>

    )

}

export default Calculator